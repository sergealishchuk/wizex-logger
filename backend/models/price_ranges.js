'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PriceRanges extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users }) {
      // define association here
    }
  }

  PriceRanges.init({
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
    ranges: {
      type: DataTypes.STRING(255),
      defaultValue: '[0, 25];[25, 50];[50, 200];[200]',
    },
  }, {
    sequelize,
    tableName: 'price_ranges',
    modelName: 'PriceRanges',
    timestamps: false,
  });

  return PriceRanges;
};
