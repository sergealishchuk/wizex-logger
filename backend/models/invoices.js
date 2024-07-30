'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Invoices extends Model {
    static associate(models) { }
  };

  Invoices.init({
    invoiceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    modifiedDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    content: {
      type: DataTypes.TEXT,
      defaultValue: '{}',
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'invoices',
    modelName: 'Invoices',
    timestamps: false,
  });
  return Invoices;
};
