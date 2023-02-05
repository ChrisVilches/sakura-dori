const express = require('express')

class BaseRouter {
  static create () {
    const router = express.Router()
    this.applyMiddlewares(router)
    return router
  }

  static applyMiddlewares (_router) {
    throw new Error('Not implemented')
  }
}

module.exports = BaseRouter
