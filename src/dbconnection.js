const { Sequelize } = require('sequelize');
const Message = require('./models/Message');
const Chat = require('./models/Chat');

const databaseUrl = process.env.DATABASE_URL;

if(typeof databaseUrl != 'string' || databaseUrl.length == 0){
  throw new Error('Set DATABASE_URL environment variable before running.');
}

console.log(`Connecting to Postgres in: ${databaseUrl}`);

const sequelize = new Sequelize(databaseUrl, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const models = {
  Chat: Chat(sequelize, Sequelize.DataTypes),
  Message: Message(sequelize, Sequelize.DataTypes)
};

async function syncAllModels(){
  for(let modelName in models){
    await models[modelName].sync();
  }
}

module.exports = {
  sequelize,
  syncAllModels,
  ...models
};
