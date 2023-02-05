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
