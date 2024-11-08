const { Sequelize } = require('sequelize')
const Message = require('./models/Message')
const Chat = require('./models/Chat')

console.log(`Connecting to Postgres in: ${process.env.DATABASE_URL}`)

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: process.env.DATABASE_REQUIRE_SSL === '1',
      rejectUnauthorized: false
    }
  }
})

const models = {
  Chat: Chat(sequelize, Sequelize.DataTypes),
  Message: Message(sequelize, Sequelize.DataTypes)
}

// TODO: I'd like to find a way to put this association in a models folder/file
// It seems it's not so easy to import one model from another model because they are wrapped.
models.Message.belongsTo(models.Chat, {
  foreignKey: {
    // TODO: It's actually a channel. This name should be changed. But note that if I change it to
    // "chatId", the meaning of messages.chatId would be different than that of chats.chatId, so
    // be careful.
    // For now, "channel" resembles the meaning of a Discord channel.
    name: 'channelId'
  }
})

async function syncAllModels () {
  for (const modelName in models) {
    await models[modelName].sync()
  }
}

module.exports = {
  sequelize,
  syncAllModels,
  ...models
}
