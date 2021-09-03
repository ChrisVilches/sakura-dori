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

  async countAll(){
    let fastCountQuery = "SELECT n_live_tup FROM pg_stat_all_tables WHERE relname = 'messages';";
    const [results] = await sequelize.query(fastCountQuery);
    const totalRecords = +results[0].n_live_tup;
    return totalRecords;
  }
}

module.exports = ReportService;
