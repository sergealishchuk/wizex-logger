'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SystemVariables extends Model { }

  SystemVariables.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 60],
          msg: 'Variable Name string length has to be between 2 and 60',
        }
      },
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: { // STRING, JSON
      type: DataTypes.STRING,
      allowNull: false,
    },
    value_STRING: DataTypes.STRING,
    value_JSON: { // will JSON format like { "value": 12 }
      type: DataTypes.TEXT,
      defaultValue: '{}',
      allowNull: false,
    },
    index: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'system_variables',
    modelName: 'SystemVariables',
    timestamps: false,
  });

  return SystemVariables;
};
