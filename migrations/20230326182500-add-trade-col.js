'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Trades', 'offerorAccepted', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
    await queryInterface.addColumn('Trades', 'offereeAccepted', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Trades');
  }
};