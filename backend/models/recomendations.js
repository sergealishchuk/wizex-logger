'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Recomendations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { Recomendations, Goods } = models;
      Recomendations.belongsTo(Goods, { as: 'product' });
    }
  }

  Recomendations.init({
    index: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'recomendations',
    modelName: 'Recomendations',
    timestamps: false,
  });

  return Recomendations;
};
