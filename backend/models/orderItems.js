'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const { Orders, OrderItems, Goods } = models;
      // define association here
      //User.hasMany(Goods);
      OrderItems.belongsTo(Orders, { foreignKey: { name: 'orderId' } });
      OrderItems.belongsTo(Goods, {
        foreignKey: {
          name: 'productId',
          type: DataTypes.INTEGER,
          allowNull: false,
        }
      })
    }
  }
  OrderItems.init({
    price: DataTypes.DECIMAL(14, 2),
    priceBuyer: DataTypes.DECIMAL(14, 2),
    qty: DataTypes.INTEGER,
    total: DataTypes.DECIMAL(14, 2),
    totalBuyer: DataTypes.DECIMAL(14, 2),
  }, {
    sequelize,
    tableName: 'order_items',
    modelName: 'OrderItems',
    timestamps: false,
  });
  return OrderItems;
};
