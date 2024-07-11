'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderProcessing extends Model {
    static associate(models) {
      const { Orders, ChatHistory } = models;
      this.belongsTo(Orders, { foreignKey: 'orderUid', as: 'processing' });
      this.hasOne(ChatHistory, { foreignKey: 'orderProcessingId', as: 'chathistory' });
    }
  };

  OrderProcessing.init({
    stage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    partnerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    authorStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'order_processing',
    modelName: 'OrderProcessing',
  });
  return OrderProcessing;
};
