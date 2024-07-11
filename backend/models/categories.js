'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const { Goods, Categories } = models;
      // define association here
      Categories.hasMany(Goods, {
        foreignKey: {
          name: 'categoryId',
          allowNull: true,
          constraints: false,
        }
      });
    }
  }
  Categories.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    parentid: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
      allowNull: false,
      validate: {
        len: {
          args: [2, 255],
          msg: 'Category Name string length has to be between 2 and 255',
        }
      }
    },
    path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    index: DataTypes.INTEGER,
    leaf: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    seo: { // will JSON format like { "value": 12 }
      type: DataTypes.TEXT,
      defaultValue: '{}',
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'categories',
    modelName: 'Categories',
    timestamps: false,
  });
  return Categories;
};
