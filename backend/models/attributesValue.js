'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AttributesValue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const { AttributesValue, Attributes } = models;
      AttributesValue.belongsTo(Attributes, { foreignKey: { name: 'attributeId' } });
    }
  }
  AttributesValue.init({
    attributeId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    attributeValue_uk: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attributeValue_en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    index: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'attributes_value',
    modelName: 'AttributesValue',
    timestamps: false,
  });

  return AttributesValue;
};
