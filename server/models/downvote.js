/** Define the Downvote database model/association
 * @exports Downvote
 * @param  {object} sequelize - sequelize
 * @param  {object} DataTypes - sequelize Datatypes
 * @return {object} The Downvote model
 */
export default (sequelize, DataTypes) => {
  const Downvote = sequelize.define('Downvote', {
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
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      }
    }
  });
  Downvote.associate = (models) => {
    Downvote.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
      onDelete: 'CASCADE'
    });
    Downvote.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };
  return Downvote;
};
