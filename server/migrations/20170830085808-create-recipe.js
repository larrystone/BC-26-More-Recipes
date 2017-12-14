module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Recipes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      imageUrl: {
        type: Sequelize.STRING
      },
      ingredients: {
        type: Sequelize.STRING
      },
      procedure: {
        type: Sequelize.STRING
      },
      viewCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      upvotes: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      downvotes: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId',
        }
      }
    });
  },
  down(queryInterface, /* Sequelize */) {
    return queryInterface.dropTable('Recipes');
  }
};
