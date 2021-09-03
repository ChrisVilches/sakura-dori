const ShowMessagesService = require('../services/ShowMessagesService');
const ChatsService = require('../services/ChatsService');
const ReportService = require('../services/ReportService');
const recentUsersService = require('../services/RealTimeRecentUsersInstance');
const parallel = require('parallel-express-middleware');
const R = require('ramda');
const router = require('./HtmlRouter').create();

// In case the user puts the two dates in wrong order, fix the order,
// and put them the correct way in the form.
const reorderDates = (req, _res, next) => {
  const query = req.query;
  if(query.dateFrom && query.dateTo){
    if(query.dateFrom > query.dateTo){
      let temp = query.dateFrom;
      query.dateFrom = query.dateTo;
      query.dateTo = temp;
    }
  }
  next();
}

const pickSearchParams = R.pick(['chatId', 'text', 'author', 'dateFrom', 'dateTo', 'page']);

const setChatData = async (req, res, next) => {
  const chatsService = new ChatsService();

  // For showing options in the select.
  res.locals.chats = await chatsService.fetchAllChats();
  res.locals.latestChatMessage = req.query.chatId ? await chatsService.fetchLastMessageDateForChat(req.query.chatId) : null;
  next();
}

const setRecentUsers = (req, res, next) => {
  res.locals.recentUsers = recentUsersService.getRecentUsers(req.query.chatId);
  next();
}

const performSearch = async (req, res, next) => {
  const msgService = new ShowMessagesService();
  const searchParams = pickSearchParams(req.query);
  const { docs, pages, total } = await msgService.find(searchParams);
  res.locals.messages = docs;
  res.locals.pages = pages;
  res.locals.total = total;
  next();
}

/* GET home page. */
router.get('/', reorderDates, setRecentUsers, parallel(setChatData, performSearch), (req, res) => {
  const searchParams = pickSearchParams(req.query);
  res.render('index', {
    // Pass all form data again (to show selected values in the form), and default page value.
    query: {
      ...searchParams,
      page: searchParams.page || 1
    }
  });
});

router.get('/about', function(_req, res){
  res.render('about');
});

router.get('/report', async function(req, res){
  const reportService = new ReportService();
  const chatsService = new ChatsService();

  const reportData = {
    latestMessage: await reportService.latestMessage(),
    totalCount: await reportService.countAll(),
    environment: req.app.get('env'),
    chats: await chatsService.fetchAllChats(),
    herokuDeployData: reportService.herokuDeployData(),
    activeUsers: {
      userCount: Object.keys(recentUsersService.getRecentUsers()).length,
      withinSeconds: process.env.ACTIVE_USERS_WITHIN_SECONDS,
      intervalSeconds: process.env.ACTIVE_USERS_INTERVAL_SECONDS
    }
  };

  res.render('report', reportData);
});

module.exports = router;
