'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payments extends Model {
    static associate(models) {
      const { Orders } = models;
      this.belongsTo(Orders, { foreignKey: 'orderUid', as: 'payments' });
    }
  };

  Payments.init({
    amount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'payments',
    modelName: 'Payments',
  });
  return Payments;
};
