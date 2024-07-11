
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const { Users, Orders, OrderItems, OrderProcessing, Chats, Payments } = models;
      // define association here
      Orders.belongsTo(Users, {
        foreignKey: {
          name: 'userId',
          type: DataTypes.INTEGER,
          allowNull: true,
        }
      });

      Orders.Items = Orders.hasMany(OrderItems, { foreignKey: 'orderId', as: 'items' });
      this.hasMany(OrderProcessing, { foreignKey: 'orderUid', as: 'processing' });
      this.hasMany(Chats, { foreignKey: 'orderUid', as: 'chats' });
      this.hasMany(Payments, { foreignKey: 'orderUid', as: 'payments' });
    }
  }
  Orders.init({
    orderUid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 25],
          msg: 'First Name string length has to be between 2 and 25',
        }
      }
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 25],
          msg: 'Last Name string length has to be between 2 and 25',
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      }
    },
    amount: DataTypes.DECIMAL(14, 2),
    amountBuyer: DataTypes.DECIMAL(14, 2),
    paid: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'waiting',
    },
    logged: DataTypes.BOOLEAN,
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    topId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sellerTopId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    buyerTopId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    currencyCodeSeller: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    currencyCodeBuyer: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    buyerMessageTopId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    sellerMessageTopId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  }, {
    sequelize,
    tableName: 'orders',
    modelName: 'Orders',
  });
  return Orders;
};
