const { Chat, Message, sequelize } = require('../dbconnection');
const R = require('ramda');

class ReportService {
  async latestMessage(){
    return await Message.findOne({
      order: [[ 'id', 'DESC' ]],
    });
  }

  herokuDeployData = () => {
    const keys = [
      'HEROKU_RELEASE_CREATED_AT',
      'HEROKU_RELEASE_VERSION',
      'HEROKU_SLUG_COMMIT'
    ];

    const isPresentString = str => typeof str == 'string' && str.trim().length > 0;

    const map = R.pickAll(keys, process.env);

    if(R.all(isPresentString, R.values(map))){
      return R.map(R.trim, {
        releaseCreatedAt: map.HEROKU_RELEASE_CREATED_AT,
        releaseVersion: map.HEROKU_RELEASE_VERSION,
        slugCommit: map.HEROKU_SLUG_COMMIT
      });
    }
  }

  async countMessageGroupByChat(){
    const chats = await Chat.findAll();
    const counts = await Message.findAll({
      attributes: [
        'chatId',
        [sequelize.fn('count', sequelize.col('chat_id')), 'messageCount']
      ],
      group: 'chatId',
      raw: true
    });

    // Add chat title name to count object.
    // TODO: This can be fixed after I have created the associations with table relationships.
    //       As of now, they tables/models are not associated.
    return counts.map(count => {
      const chat = chats.find(chat => chat.chatId == count.chatId);
      return { ...count, title: chat.title };
    });
  }

  async countAll(){
    return await Message.count();
  }
}

module.exports = ReportService;
