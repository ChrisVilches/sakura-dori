const { Message, Chat, sequelize } = require('../dbconnection')
const camelcaseKeys = require('camelcase-keys')
const ChatsService = require('./ChatsService')

const IndexState = Object.freeze({ MARKED_AS_DELETED: 1, INDEXED: 2, SKIPPED: 3, ERROR: 4 })

class IndexMessagesService {
  async indexBatch (chatId, messages) {
    const resultSummary = {
      MARKED_AS_DELETED: 0,
      INDEXED: 0,
      SKIPPED: 0,
      ERROR: 0
    }

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i]
      msg.chatId = chatId
      const chat = await (new ChatsService()).findOne(chatId)
      msg.channelId = chat.id

      // Add them in order (await). The reason is that the timestamp doesn't include seconds, so
      // in order to know the order of submission (in the chat), keep the order in which they are fetched.
      const result = await this.#upsertMessage(msg)

      Object.keys(IndexState).forEach(key => {
        if (result === IndexState[key]) {
          resultSummary[key]++
        }
      })
    }

    return camelcaseKeys(resultSummary)
  }

  #upsertMessage = async message => {
    try {
      return await sequelize.transaction(async t => {
        const found = await Message.findOne({
          // It's difficult to know if the long string ID in the HTML tag is actually unique.
          // So just in case, I use more fields to guarantee it's a unique message.
          where: {
            channelId: message.channelId,
            ytId: message.id
          }
        }, { transaction: t })

        if (found) {
          // The message was already saved.
          if (!found.deleted && message.deleted) {
            console.log('Changing delete status. Content:', message.author, message.text)
            found.deleted = true
            await found.save({ transaction: t })
            return IndexState.MARKED_AS_DELETED
          }
          return IndexState.SKIPPED
        }

        console.log('Saving new message:', message.author, message.text)

        await Message.create({
          ytId: message.id,
          icon: message.icon,
          timestamp: message.timestamp,
          author: message.author,
          text: message.text,
          deleted: message.deleted,
          chatId: message.chatId,
          channelId: message.channelId
        }, { transaction: t })

        // Increase one to message count. This can be done better with a trigger.

        const chat = await Chat.findOne({
          where: { chatId: message.chatId }
        }, { transaction: t })

        await chat.increment('messageCount', { transaction: t })

        return IndexState.INDEXED
      })
    } catch (error) {
      console.log(`Transaction error: ${error}`)
      return IndexState.ERROR
    }
  }
}

module.exports = IndexMessagesService
