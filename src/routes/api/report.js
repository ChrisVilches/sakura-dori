const router = require('./ApiRouter').create();
const recentUsersService = require('../../services/RealTimeRecentUsersInstance');

router.get('/active_users', async function(req, res) {
  const { chatId } = req.query;
  res.json(recentUsersService.getRecentUsers(chatId));
});

module.exports = router;
