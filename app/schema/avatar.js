"use strict";

module.exports = app => {
  const { STRING, DATE, INTEGER } = app.Sequelize;

  return {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    md5: {
      type: STRING,
      allowNull: false,
      unique: true, // MD5 值唯一
    },
    avatarUrl: {
      type: STRING,
      allowNull: false, // 不能为空
    },
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
    },
    createdTime: {
      type: DATE,
      allowNull: false,
    },
  };
};
