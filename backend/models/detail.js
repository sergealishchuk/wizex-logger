'use strict';
const {
  Model
} = require('sequelize');

const Goods = require('./goods');

module.exports = (sequelize, DataTypes) => {
  class Detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { Detail, Goods } = models;
      Detail.belongsTo(Goods, { foreginKey: { name: 'goodId' } });
    }
  }

  Detail.init({
    goodId: DataTypes.INTEGER,
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    descriptionen: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    attributes: { // will JSON format like { "value": 12 }
      type: DataTypes.TEXT,
      defaultValue: '{}',
      allowNull: false,
    },
    seo: { // will JSON format like { "value": 12 }
      type: DataTypes.TEXT,
      defaultValue: '{}',
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'detail',
    modelName: 'Detail',
    timestamps: false,
  });
  return Detail;
};
