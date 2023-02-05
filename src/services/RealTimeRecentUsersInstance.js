const RealTimeRecentUsersService = require('./RealTimeRecentUsersService')

/**
 * This module contains one instance of the RealTimeRecentUsersService class,
 * so it can be used globally in the app, without having many instances (which
 * are computationally expensive, and only one is necessary.)
 *
 * In other words, it's a singleton wrapper for a class that's originally not a singleton.
*/

const recentUsersService = new RealTimeRecentUsersService(
  process.env.ACTIVE_USERS_WITHIN_SECONDS,
  process.env.ACTIVE_USERS_INTERVAL_SECONDS
)

recentUsersService.start()

module.exports = recentUsersService
