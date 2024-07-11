'use strict';
const {
  Model
} = require('sequelize');
const Detail = require('./detail');

module.exports = (sequelize, DataTypes) => {
  class Goods extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const { Goods, OrderItems, Detail } = models;
      Goods.Detail = Goods.hasOne(Detail, {foreignKey: 'goodId', as: 'detail'});
      // define association here
      Goods.hasOne(OrderItems, {
        foreignKey: {
          name: 'productId',
          type: DataTypes.INTEGER,
          allowNull: false,
        }
      })
    }
  }

  Goods.init({
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 255],
          msg: 'Category Name string length has to be between 2 and 255',
        }
      }
    },
    nameen: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [2, 255],
          msg: 'Category Name string length has to be between 2 and 255',
        }
      }
    },
    path: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    price: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
    },
    currencyCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    rating: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    temporaryLocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    removed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize,
    tableName: 'goods',
    modelName: 'Goods',
  });
  return Goods;
};
