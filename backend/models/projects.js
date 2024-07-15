'use strict';
const { sassTrue } = require('sass');
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Projects extends Model { }

  Projects.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publicLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateCreate: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW'),
      allowNull: false,
    },
    apiKey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    AccessIsAllowed: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
      defaultValue: [],
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  }, {
    sequelize,
    tableName: 'projects',
    modelName: 'Projects',
    timestamps: false,
  });

  return Projects;
};
