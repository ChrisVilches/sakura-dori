#!/usr/bin/env node

require('../appConfig').config()
const moment = require('moment')
const ChatsService = require('../services/ChatsService')

// Fix all message counts in case they got incorrect.

async function setCorrectMessageCount () {
  const chatsService = new ChatsService()
  const allChats = await chatsService.fetchAllChats()

  for (const chat of allChats) {
    await chatsService.setCorrectMessageCount(chat.chatId)
  }
}

(async function () {
  console.log(`setCorrectMessageCount, start at ${moment()}`)
  await setCorrectMessageCount()
  console.log(`setCorrectMessageCount, end at ${moment()}`)
})()
