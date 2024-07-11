'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Carousel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Carousel.init({
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    htmlcontent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    htmlcontenten: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    withhtml: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    effect: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    index: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'carousel',
    modelName: 'Carousel',
    timestamps: false,
  });

  return Carousel;
};
