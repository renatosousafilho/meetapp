'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('meetups', { 
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false, 
      },
      start_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      banner_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      banner_path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        alllowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        alllowNull: false,
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('meetups');
  }
};
