module.exports = app => {
  const { STRING, INTEGER, JSON, UUIDV4, ENUM, DATE, BIGINT } = app.Sequelize;

  return {
    id: {
      type: STRING(38),
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    member_package_id: {
      type: STRING(38),
      allowNull: false,
    },
    group_name: {
      type: STRING(50),
      comment: "组合策略名称（如'上衣+裤子组合'）",
    },
    require_type: {
      type: ENUM("FIXED", "FLEXIBLE"),
      defaultValue: "FIXED",
      comment: "FIXED-固定组合 / FLEXIBLE-灵活组合",
    },
    combination_rules: {
      type: JSON,
      comment: "组合规则配置，必需品类[CLOTHING, PANTS]",
    }, // 示例：{ groups: [{group_id:1, min:1, max:1}, {group_id:2, min:1}] }
    min_total: {
      type: INTEGER,
      comment: "整套组合最少选择总数",
    },
    max_total: {
      type: INTEGER,
      comment: "整套组合最多选择总数",
    },
    createdTime: {
      type: DATE,
      allowNull: false,
    },
    creatorName: {
      type: STRING(76),
      allowNull: false,
    },
    creatorId: {
      type: STRING(38),
      allowNull: false,
    },
    lastModifiedTime: {
      type: DATE,
      allowNull: false,
    },
    lastModifierName: {
      type: STRING(76),
      allowNull: false,
    },
    lastModifierId: {
      type: STRING(38),
      allowNull: false,
    },
    version: {
      type: BIGINT,
      defaultValue: 0,
    },
  };
};
