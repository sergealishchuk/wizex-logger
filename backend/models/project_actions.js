'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProjectActions extends Model { }

  ProjectActions.init({
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    level: { // error, debug, warnign
      type: DataTypes.STRING,
      defaultValue: 'error',
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      defaultValue: '',
      allowNull: false,
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: { // full body
      type: DataTypes.TEXT,
      defaultValue: '{}',
      allowNull: false,
    },
    startedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW'),
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'project_actions',
    modelName: 'ProjectActions',
    timestamps: false,
  });

  return ProjectActions;
};
