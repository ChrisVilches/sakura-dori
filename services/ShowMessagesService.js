const { Message } = require('../dbconnection');
const { Op } = require('sequelize');
const R = require('ramda');

class ShowMessagesService {
  async find(params = {}){
    const where = this.#whereFilters(params);

    const query = {
      where,
      page: params.page || 1,
      paginate: 100,
      order: [['createdAt', 'DESC']]
    };

    const paginatedMessages = await Message.paginate(query);

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
}

module.exports = ShowMessagesService;
