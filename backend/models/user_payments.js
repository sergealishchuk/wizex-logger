'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserPayments extends Model { };

  UserPayments.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    payment: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    debit: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    operationType: DataTypes.INTEGER,
    params: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '{}',
    },
    comment: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'user_payments',
    modelName: 'UserPayments',
    updatedAt: false,
  });
  return UserPayments;
};
