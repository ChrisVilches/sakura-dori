const sequelizePaginate = require('sequelize-paginate')

// TODO: Add restriction so that values cannot be null.

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('messages', {
    author: DataTypes.STRING,
    text: DataTypes.TEXT,
    deleted: DataTypes.BOOLEAN,
    timestamp: DataTypes.DATE,
    ytId: DataTypes.STRING,
    icon: DataTypes.STRING
  }, {
    underscored: true
    // Note: Indexes are for now just added directly to the database
    //       without using any migration manager tool.
  })

  sequelizePaginate.paginate(Message)
  return Message
}
