const { Chat, Message, sequelize } = require('../dbconnection');
const R = require('ramda');

class ChatsService {
  async fetchAllChats(){
    return await Chat.findAll();
  }

  async fetchLastMessageDateForChat(chatId){
    return await Message.findOne({
      where: { chatId },
      order: [['id', 'DESC']]
    });
  }

  // TODO: Optimize this. It's too slow. For now it's unused.
  async fetchLastMessageDateForChats(){
    throw new Error('Optimize before using.');
    const lastMessages = await Message.findAll({
      attributes: [
        sequelize.literal('DISTINCT ON(chat_id) id'),
        'chatId',
        'createdAt'
      ],
      order: [['chatId', 'DESC'], ['createdAt', 'DESC']],
      raw: true
    });
    return R.mergeAll(lastMessages.map(m => ({ [m.chatId]: m.createdAt })));
  }

  async upsertChat(chatId = '', title = ''){
    chatId = chatId.trim();
    title = title.trim();

    if(chatId.length == 0) throw new Error('Chat ID cannot be empty.');
    if(title.length == 0) throw new Error('Title cannot be empty.');

    return await sequelize.transaction(async t => {
      const found = await Chat.findOne({ where: { chatId } }, { transaction: t });

      if(found){
        // Update title only.
        found.title = title;
        return await found.save({ transaction: t });
      }

      return await Chat.create({ chatId, title }, { transaction: t });
    });
  }
}

module.exports = ChatsService;
