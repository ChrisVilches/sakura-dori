const { Chat, Message, sequelize } = require('../dbconnection')

class ChatsService {
  async fetchAllChats () {
    return await Chat.findAll()
  }

  async findOne (chatId) {
    return await Chat.findOne({ where: { chatId } })
  }

  async fetchLastMessageDateForChat (chatId) {
    return await Message.findOne({
      where: { chatId },
      order: [['id', 'DESC']]
    })
  }

  async setCorrectMessageCount (chatId) {
    const correctCount = await Message.count({ where: { chatId } })
    const chat = await Chat.findOne({ where: { chatId } })

    if (chat.messageCount === correctCount) {
      console.log('✅ Counts are the same')
    } else {
      console.log(`🔨 Updating ${chat.messageCount} -> ${correctCount}`)
    }

    chat.messageCount = correctCount
    await chat.save()
  }

  // TODO: Optimize this. It's too slow. For now it's unused.
  async fetchLastMessageDateForChats () {
    throw new Error('Optimize before using.')
    /*
    const lastMessages = await Message.findAll({
      attributes: [
        sequelize.literal('DISTINCT ON(chat_id) id'),
        'chatId',
        'createdAt'
      ],
      order: [['chatId', 'DESC'], ['createdAt', 'DESC']],
      raw: true
    })
    return R.mergeAll(lastMessages.map(m => ({ [m.chatId]: m.createdAt })))
    */
  }

  async upsertChat (chatId = '', title = '', imageUrl = '') {
    chatId = chatId.trim()
    title = title.trim()

    if (chatId.length === 0) throw new Error('Chat ID cannot be empty.')
    if (title.length === 0) throw new Error('Title cannot be empty.')

    return await sequelize.transaction(async t => {
      const found = await Chat.findOne({ where: { chatId } }, { transaction: t })

      if (found) {
        // Update title only.
        found.title = title

        // Update Image URL only if it's not empty.
        if (typeof imageUrl === 'string' && imageUrl.length > 0) {
          found.imageUrl = imageUrl
        }
        return await found.save({ transaction: t })
      }

      return await Chat.create({ chatId, title, imageUrl }, { transaction: t })
    })
  }
}

module.exports = ChatsService
