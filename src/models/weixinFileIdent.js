export default (sequelize, DataTypes) => {
  const M = sequelize.define('weixinFileIdent', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  })
  M.associate = function (models) {
    // associations can be defined here
  }
  return M
}
