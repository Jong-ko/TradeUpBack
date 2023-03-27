'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Trades', 'offerorItemID', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Trades');
  }
};