'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProfileChangesLog extends Model {
    static associate(models) {
    }
  };

  ProfileChangesLog.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    was: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW'),
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'profile_changes_log',
    modelName: 'ProfileChangesLog',
    timestamps: false,
  });
  return ProfileChangesLog;
};
