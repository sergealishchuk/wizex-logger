'use strict';
const {
  Model
} = require('sequelize');

const Goods = require('./goods');

module.exports = (sequelize, DataTypes) => {
  class Articles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Articles.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [2, 255],
          msg: 'Article title length has to be between 2 and 255',
        }
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
      defaultValue: [],
    },
    authorId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    lastEditorId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    seo: { // will JSON format like { "value": 12 }
      type: DataTypes.TEXT,
      defaultValue: '{}',
      allowNull: false,
    },
    titleEdited: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [2, 255],
          msg: 'Article title string length has to be between 2 and 255',
        }
      },
      defaultValue: null,
    },
    bodyEdited: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    tagsEdited: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },
    seoEdited: { // will JSON format like { "value": 12 }
      type: DataTypes.TEXT,
      defaultValue: '{}',
      allowNull: false,
    },
    editedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  }, {
    sequelize,
    tableName: 'articles',
    modelName: 'Articles',
    timestamps: true,
  });
  return Articles;
};
