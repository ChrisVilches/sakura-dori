// TODO: Add restriction so that values cannot be null.

module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('chats', {
    chatId: DataTypes.STRING,
    title: DataTypes.STRING,
    messageCount: DataTypes.INTEGER
  }, {
    underscored: true,
    // Note: Indexes are for now just added directly to the database
    //       without using any migration manager tool.
  });

  return Chat;
}
