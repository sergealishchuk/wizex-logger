'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChatHistory extends Model {
    static associate(models) {
      const { OrderProcessing } = models;
      this.belongsTo(OrderProcessing, { foreignKey: 'orderProcessingId', as: 'chathistory' });
    }
  };

  ChatHistory.init({
    messageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    edited: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    operation: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    markerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'chat_history',
    modelName: 'ChatHistory',
  });
  return ChatHistory;
};
