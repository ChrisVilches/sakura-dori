const { Message } = require('../dbconnection');
const { Op } = require('sequelize');
const ReportService = require('./ReportService');
const R = require('ramda');

// Other ways to optimize this:
// Remove pagination and simply show like a "next page" button, but without specifying
// how many pages there are left.
//
// Deprecating ILIKE '%xxx%' searches, and just use ILIKE 'xxx%' or full-text search features.
//
// In Digital Ocean it became kind of slow, but using optimizations it can become really fast again.
//
// Another way to optimize is to paginate when search is empty (for all pages), which is very fast
// when using the fast count, but don't paginate (leave like a "infinite scroll" mechanism) if the
// search form was filled (chat ID, text, etc). Infinite scroll uses a "last ID" to know where to fetch from,
// so it doesn't need to execute an expensive "OFFSET".
//
// Also, when filtering by username, create a flag that says "exact" (boolean) which uses == comparison
// using indexes, instead of ILIKE.
class ShowMessagesService {
  async find(params = {}){
    params = this.#compactParams(params);
    const where = this.#whereFilters(params);

    const query = {
      where,
      order: [['createdAt', 'DESC']]
    };

    let paginatedMessages;

    // Case when it's homepage without search.
    // Optimization to make homepage faster. Counting is very slow in general, but this counting
    // can be done very fast by asking the stats collector instead of doing a normal count.
    //
    // TODO: For now, it only works for first page only.
    if(Object.keys(params).length == 0 || (Object.keys(params).length == 1 && params.page == 1)) {
      const totalRecords = await this.#countAll();
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
    const exactString = params.exact == 'true';

    return R.mergeAll([
      this.#filterByChat(params.chatId),
      this.#filterByAuthor(params.author, exactString),
      this.#filterByText(params.text, exactString),
      this.#filterByDate(params.dateFrom, params.dateTo)
    ]);
  }

  #filterByAuthor = (author, exact) => {
    if(typeof author == 'string' && author.trim().length > 0){
      author = author.trim();
      const likeSearch = { author: { [Op.iLike]: `%${author.trim()}%` } };
      const exactSearch = { author };
      return exact ? exactSearch : likeSearch;
    }
    return {};
  }

  #filterByText = (text, exact) => {
    if(typeof text == 'string' && text.trim().length > 0){
      text = text.trim();
      const likeSearch = { text: { [Op.iLike]: `%${text.trim()}%` } };
      const exactSearch = { text };
      return exact ? exactSearch : likeSearch;
    }
    return {};
  }

  #filterByChat = chatId => {
    if(chatId) return { chatId };
    return {};
  }

  #filterByDate = (from, to) => {
    if(from && to){
      return { createdAt: { [Op.between]: [from, to] } };
    }

    if(from) {
      return { createdAt: { [Op.gte]: from } };
    }

    if(to) {
      return { createdAt: { [Op.lte]: to } };
    }

    return {};
  }

  #countAll = async () => {
    return (new ReportService()).countAll();
  }

  #compactParams = params => {
    let nonEmptyString = x => (typeof x == 'string' && x.trim().length > 0);
    let compact = R.filter(x => typeof x == 'number' || nonEmptyString(x));

    return compact(params);
  }
}

module.exports = ShowMessagesService;
