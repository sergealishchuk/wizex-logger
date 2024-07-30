'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PaymentAccounts extends Model { };

  PaymentAccounts.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    tariff: DataTypes.INTEGER,
    next_tariff: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    tariff_valid_until: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    balance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    sequelize,
    tableName: 'payment_accounts',
    modelName: 'PaymentAccounts',
    timestamps: false,
  });
  return PaymentAccounts;
};
