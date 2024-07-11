'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attributes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const { Attributes, AttributesValue } = models;
      Attributes.Values = Attributes.hasMany(AttributesValue, { foreignKey: 'attributeId', as: 'values' });
    }
  }
  Attributes.init({
    attributeId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    categoryId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    attributeName_uk: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 60],
          msg: 'Category Name string length has to be between 2 and 60',
        }
      }
    },
    attributeName_en: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 60],
          msg: 'Category Name string length has to be between 2 and 60',
        }
      }
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    //desc: DataTypes.STRING,
    index: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'attributes',
    modelName: 'Attributes',
    timestamps: false,
  });

  return Attributes;
};
