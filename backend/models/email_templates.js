'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmailTemplates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    
  }
  EmailTemplates.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 60],
          msg: 'Category Name string length has to be between 2 and 60',
        }
      },
      unique: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 255],
          msg: 'Subject string length has to be between 2 and 255',
        }
      },
    },
    body: {
      type: DataTypes.TEXT,
      defaultValue: 'empty template',
      allowNull: false,
    },
    params: { // will JSON format like { "value": 12 }
      type: DataTypes.TEXT,
      defaultValue: '{}',
      allowNull: false,
    },
    index: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'email_templates',
    modelName: 'EmailTemplates',
    timestamps: false,
  });

  return EmailTemplates;
};
