'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExchangeProcessing extends Model {
    static associate(models) {
    }
  };

  ExchangeProcessing.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    currencyCode: {
      type: DataTypes.STRING(3),
      primaryKey: true,
      allowNull: false,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rate: {
      type: DataTypes.DECIMAL(14, 6),
      allowNull: false,
    },
    operation: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW'),
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'exchange_processing',
    modelName: 'ExchangeProcessing',
    timestamps: false,
  });
  return ExchangeProcessing;
};
