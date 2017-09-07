
export default (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    content: DataTypes.STRING,
    recipeId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Recipes',
        key: 'id',
        as: 'recipeId',
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      }
    }
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
    });
    Review.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };
  return Review;
};
