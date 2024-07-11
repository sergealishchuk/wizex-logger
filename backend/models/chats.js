'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Chats extends Model {
    static associate(models) {
      const { Orders } = models;
      this.belongsTo(Orders, { foreignKey: 'orderUid', as: 'chats' });
    }
  };

  Chats.init({
    from: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    to: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 255],
          msg: 'Message string length has to be between 1 and 255',
        }
      }
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    editedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    markerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'chats',
    modelName: 'Chats',
  });
  return Chats;
};
