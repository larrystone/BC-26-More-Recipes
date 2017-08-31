
export default (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    recipeId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Recipes',
        key: 'id',
        as: 'userId',
      }
    }
  }, {
    classMethods: {
      associate(models) {
        Review.belongsTo(models.Recipe, {
          foreignKey: 'recipeId',
          onDelete: 'CASCADE'
        });
        Review.belongsTo(models.User, {
          foreignKey: 'userId',
          onDelete: 'CASCADE'
        });
      }
    }
  });
  return Review;
};
