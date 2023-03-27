module.exports = {
    up: (queryInterface, Sequelize) => queryInterface
      .addConstraint('Trades', {
        type: 'UNIQUE',
        fields: ['offerorID'],
        name: 'unique_offerorID',
      }),
    down: (queryInterface, Sequelize) => queryInterface
      .removeConstraint('Trades', 'unique_offerorID'),
  };