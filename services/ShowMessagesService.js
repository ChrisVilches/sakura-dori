const { sequelize, Message } = require('../dbconnection');
const { Op } = require('sequelize');
const R = require('ramda');

// Other ways to optimize this:
// Remove pagination and simply show like a "next page" button, but without specifying
// how many pages there are left.
//
// Deprecating ILIKE '%xxx%' searches, and just use ILIKE 'xxx%' or full-text search features.
class ShowMessagesService {
  async find(params = {}){
    params = this.#compactParams(params);
    const where = this.#whereFilters(params);

    const query = {
      where,
      order: [['id', 'DESC']]
    };

    let paginatedMessages;

    // Case when it's homepage without search.
    // Optimization to make homepage faster. Counting is very slow in general, but this counting
    // can be done very fast by asking the stats collector instead of doing a normal count.
    //
    // TODO: For now, it only works for first page only.
    if(Object.keys(params).length == 0 || (Object.keys(params).length == 1 && params.page == 1)) {
      let fastCountQuery = "SELECT n_live_tup FROM pg_stat_all_tables WHERE relname = 'messages';";
      const [results] = await sequelize.query(fastCountQuery);
      const totalRecords = +results[0].n_live_tup;
      query.limit = process.env.PER_PAGE;

      paginatedMessages = {
        docs: await Message.findAll(query),
        pages: Math.ceil(totalRecords / process.env.PER_PAGE),
        total: totalRecords
      };
    } else {
      query.page = params.page || 1;
      query.paginate = Number(process.env.PER_PAGE);
      paginatedMessages = await Message.paginate(query);
    }

    return paginatedMessages;
  }

  #whereFilters = params => {
    return R.mergeAll([
      this.#filterByChat(params.chatId),
      this.#filterByAuthor(params.author),
      this.#filterByText(params.text),
      this.#filterByDate(params.dateFrom, params.dateTo)
    ]);
  }

  #filterByAuthor = author => {
    if(typeof author == 'string' && author.trim().length > 0){
      return { author: { [Op.iLike]: `%${author.trim()}%` } };
    }
    return {};
  }

  #filterByText = text => {
    if(typeof text == 'string' && text.trim().length > 0){
      return { text: { [Op.iLike]: `%${text.trim()}%` } };
    }
    return {};
  }

  #filterByChat = chatId => {
    if(chatId) return { chatId };
    return {};
  }

  #filterByDate = (from, to) => {
    if(from && to){
      return { timestamp: { [Op.between]: [from, to] } };
    }

    if(from) {
      return { timestamp: { [Op.gte]: from } };
    }

    if(to) {
      return { timestamp: { [Op.lte]: to } };
    }

    return {};
  }

  #compactParams = params => {
    let nonEmptyString = x => (typeof x == 'string' && x.trim().length > 0);
    let compact = R.filter(x => typeof x == 'number' || nonEmptyString(x));

    return compact(params);
  }
}

module.exports = ShowMessagesService;
