'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExchangeRates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users }) {
      // define association here
    }
  }

  ExchangeRates.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    currencyCode: {
      type: DataTypes.STRING(3),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    digitalCode: {
      type: DataTypes.STRING(3),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    rate: {
      type: DataTypes.DECIMAL(14, 6),
      allowNull: false,
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [1, 16],
          msg: 'Currency alias string length has to be between 1 and 255',
        }
      }
    },
    symbolFirst: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW'),
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'exchange_rates',
    modelName: 'ExchangeRates',
    timestamps: false,
  });

  return ExchangeRates;
};
