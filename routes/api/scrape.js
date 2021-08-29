const router = require('./ApiRouter').create();
const IndexMessagesService = require('../../services/IndexMessagesService');
const ChatsService = require('../../services/ChatsService');
const indexMessagesService = new IndexMessagesService();
const chatsService = new ChatsService();

router.put('/index_messages', async function(req, res) {
  const { chatId, messages } = req.body;
  const result = await indexMessagesService.indexBatch(chatId, messages);
  res.json(result);
});

router.put('/index_chat_title', async function(req, res) {
  const { chatId, title } = req.body;
  const chatRecord = await chatsService.upsertChat(chatId, title);
  res.json(chatRecord);
});

module.exports = router;
