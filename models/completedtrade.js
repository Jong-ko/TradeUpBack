'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompletedTrade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CompletedTrade.init({
    offerorID: DataTypes.STRING,
    offereeID: DataTypes.STRING,
    itemID: DataTypes.INTEGER,
    offerorItemID: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'CompletedTrade',
  });
  return CompletedTrade;
};