const { Message } = require('../dbconnection')
const { Op } = require('sequelize')
const moment = require('moment')
const R = require('ramda')
const cron = require('node-cron')

/**
 * Periodically gets the active users in each chat (and globally in all chats),
 * and provides a method for quickly getting the results (no computations needed for the getter).
 *
 * Recommended way to use:
 *
 * Start only one instance, and execute the .start() method to begin computing active users.
 * Query this structure (in O(1) time) to get the active users in a certain chat, or globally.
 *
 * Even if the main app is escalated, it's enough to have only one service running that provides
 * the necessary data for all instances of the main process.
 *
 * It can be improved by moving this to a different process (server) and have it as a microserver,
 * which responds to a GET HTTP response, or alternatively posts the data to a Redis-like database,
 * that can also be accessed by the main process.
*/

class RealTimeRecentUsersService {
  constructor (withinSeconds, intervalSeconds) {
    if (!withinSeconds) {
      throw new Error('Specify period of user activity.')
    }
    if (!intervalSeconds) {
      throw new Error('Specify periodicity (seconds).')
    }
    this.withinSeconds = withinSeconds
    this.intervalSeconds = intervalSeconds
    this.cronTask = null
    this.preResult = {}
    this.result = {}
    this.resultAllChats = []
    this.icons = {}
    this.lastFetchedMessageId = null

    this.initializeStoppedCronTask()
  }

  // Initialize but don't begin execution.
  initializeStoppedCronTask = () => {
    const cronString = `*/${this.intervalSeconds} * * * * *`
    if (!cron.validate(cronString)) {
      throw new Error(`Cron string "${cronString}" is not valid.`)
    }

    this.cronTask = cron.schedule(cronString, this.#periodicJob, { scheduled: false })
  }

  start () {
    if (!this.cronTask) return
    this.cronTask.start()
  }

  stop () {
    if (!this.cronTask) return
    this.cronTask.stop()
  }

  getRecentUsers = chatId => {
    if (typeof chatId === 'string' && chatId.length > 0) return this.result[chatId] || []
    return this.resultAllChats || []
  }

  #cleanOldMessages = () => {
    const isRecent = date => moment().diff(date, 'seconds') <= this.withinSeconds

    Object.entries(this.preResult).forEach(([_chat, authors]) => {
      Object.keys(authors).forEach(author => {
        authors[author] = authors[author].filter(isRecent)
        if (authors[author].length === 0) delete authors[author]
      })
    })
  }

  // Converts a map with the format author -> Date Array to an array with
  // the format [{ author, icon, messageDates, count }, { ... }].
  #authorDateMapToArray = (authorDates) => {
    return Object.entries(authorDates).map(([author, dates]) => ({
      author,
      messageDates: dates.sort((a, b) => b - a),
      count: dates.length,
      icon: this.icons[author]
    })).sort(this.#sortByDateArray)
  }

  #sortByDateArray = (a, b) => {
    a = a.messageDates
    b = b.messageDates
    if (a.length !== b.length) return b.length - a.length
    for (let i = 0; i < a.length; i++) {
      const dateA = a[i]
      const dateB = b[i]
      if (dateA !== dateB) return dateB - dateA
    }
    return 0
  }

  #generateReadyResult = () => {
    this.result = {}
    Object.entries(this.preResult).forEach(([chat, authors]) => {
      // Convert from map to list.
      this.result[chat] = this.#authorDateMapToArray(authors)
    })
  }

  #generateReadyResultAllChats = () => {
    const authorDates = {}

    // Concat all dates in a new map (author -> Date Array).
    Object.entries(this.preResult).forEach(([_chat, authors]) => {
      Object.entries(authors).forEach(([author, dates]) => {
        authorDates[author] = (authorDates[author] || []).concat(dates)
      })
    })

    this.resultAllChats = this.#authorDateMapToArray(authorDates)
  }

  #periodicJob = async () => {
    const newMessages = await this.#fetchNewMessages()
    newMessages.forEach(msg => {
      const chatId = msg.chat.chatId
      // Store one icon for each name. It doesn't detect repeated users.
      this.icons[msg.author] = msg.icon
      this.preResult[chatId] = this.preResult[chatId] || {}
      this.preResult[chatId][msg.author] = this.preResult[chatId][msg.author] || []
      this.preResult[chatId][msg.author].push(msg.createdAt)
    })

    this.#cleanOldMessages()
    this.#generateReadyResult()
    this.#generateReadyResultAllChats()
  }

  #fetchNewMessages = async () => {
    const messages = await Message.findAll({
      where: this.#fetchCondition(),
      order: [['id', 'DESC']],
      raw: true
    })

    this.#saveLatestId(messages)

    return messages
  }

  #saveLatestId = messages => {
    if (messages.length === 0) return
    this.lastFetchedMessageId = R.compose(
      R.apply(Math.max),
      R.pluck('id')
    )(messages)
  }

  #fetchCondition = () => {
    if (this.lastFetchedMessageId) {
      return { id: { [Op.gt]: this.lastFetchedMessageId } }
    } else {
      const dateFrom = moment().subtract(this.withinSeconds, 'seconds')
      return { createdAt: { [Op.gte]: dateFrom } }
    }
  }
}

module.exports = RealTimeRecentUsersService
