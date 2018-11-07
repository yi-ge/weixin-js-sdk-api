export default (sequelize, DataTypes) => {
  const M = sequelize.define('weixinJSSDKKey', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    domain: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    APPID: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    APPSECRET: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  })
  M.associate = function (models) {
    // associations can be defined here
  }
  return M
}
