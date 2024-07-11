'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SentMessages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const { Users, SentMessages } = models;
      Users.hasMany(SentMessages, {
        foreignKey: {
          name: 'userId',
        }
      });
      SentMessages.belongsTo(Users, {
        foreignKey: {
          name: 'userId',
        }
      });
    }
  }

  SentMessages.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    success: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    failure: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    messageType: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    orderUid: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deliveryAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveryTime: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    delivered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize,
    tableName: 'sent_messages',
    modelName: 'SentMessages',
    timestamps: false,
  });

  return SentMessages;
};
