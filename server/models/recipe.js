/** Define the Recipe database model/association
 * @exports Recipe
 * @param  {object} sequelize - sequelize
 * @param  {object} DataTypes - sequelize Datatypes
 * @return {object} The Recipe model
 */
export default (sequelize, DataTypes) => {
  const Recipe = sequelize.define('Recipe', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'recipe name cannot be empty'
        }
      }
    },
    description: DataTypes.TEXT,
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'ingredients cannot be empty'
        }
      }
    },
    imageUrl: DataTypes.STRING,
    imageId: DataTypes.STRING,
    procedure: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'enter procedure clearly'
        }
      }
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    upvotes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    downvotes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      }
    }
  });
  Recipe.associate = (models) => {
    Recipe.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    Recipe.hasMany(models.Review, {
      foreignKey: 'recipeId'
    });
    Recipe.hasMany(models.Favorite, {
      foreignKey: 'recipeId'
    });
    Recipe.hasMany(models.Upvote, {
      foreignKey: 'recipeId'
    });
    Recipe.hasMany(models.Downvote, {
      foreignKey: 'recipeId'
    });
  };
  return Recipe;
};
