'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class HomeBlocks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  HomeBlocks.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    sectionid: {
      type: DataTypes.INTEGER,
    },
    sourceid: {
      type: DataTypes.INTEGER,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    texten: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    index: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'homeblocks',
    modelName: 'HomeBlocks',
    timestamps: false,
  });

  return HomeBlocks;
};
