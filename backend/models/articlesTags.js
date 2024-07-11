'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ArticlesTags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // const { AttributesValue, Attributes } = models;
      // AttributesValue.belongsTo(Attributes, { foreignKey: { name: 'attributeId' } });
    }
  }
  ArticlesTags.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    index: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'articles_tags',
    modelName: 'ArticlesTags',
    timestamps: false,
  });

  return ArticlesTags;
};
