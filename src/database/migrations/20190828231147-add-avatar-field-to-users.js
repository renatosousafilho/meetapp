'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'avatar_id',
      {
        type: Sequelize.INTEGER,
        references: { model: 'avatars', key: 'id'},
        onUpdate: 'CASCADE', // TODO: para que vai funcionar o cascade nesse caso?
        allowNull: true
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'avatar_id');
  }
};
