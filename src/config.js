const isDev = process.env.NODE_ENV === 'development'

export const DB_MYSQL = {
  host: isDev ? '123.123.123.123' : '123.123.123.123',
  port: 3306,
  // prefix: 'js_',
  connectionLimit: 20,
  database: '',
  username: '',
  password: '',
  dialect: 'mysql',
  dialectOptions: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_bin',
    connectionLimit: 100
    // supportBigNumbers: true,
    // bigNumberStrings: true
  },
  pool: {
    max: 50,
    min: 0,
    idle: 10000
  },
  define: {
    timestamps: true, // 添加时间戳属性 (updatedAt, createdAt)
    paranoid: true, // 不删除数据库条目，但将新添加的属性deletedAt设置为当前日期（删除完成时）。 paranoid 只有在启用时间戳时才能工作
    underscored: false, // 使用驼峰样式自动添加属性
    freezeTableName: true // 禁用修改表名; 默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数。 如果你不想这样，请设置以下内容
  }
}

export const Redis = {
  host: isDev ? '123.123.123.123' : '123.123.123.123',
  port: isDev ? 6379 : 6379,
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: '',
  db: 1
}
