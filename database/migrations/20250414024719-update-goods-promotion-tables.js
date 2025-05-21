"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 获取表结构信息的辅助函数
    const describeTable = async tableName => {
      try {
        return await queryInterface.describeTable(tableName);
      } catch (error) {
        console.error(`Error describing table ${tableName}:`, error);
        return {};
      }
    };

    // 检查字段是否符合要求的辅助函数
    const checkFieldMatches = (fieldInfo, targetType, allowNull, comment) => {
      // 检查字段类型
      if (fieldInfo.type.toString() !== targetType.toString()) {
        return false;
      }
      // 检查 allowNull
      if (fieldInfo.allowNull !== allowNull) {
        return false;
      }
      // 检查 comment（如果存在）
      if (comment && fieldInfo.comment !== comment) {
        return false;
      }
      return true;
    };

    // 检查枚举值是否匹配的辅助函数
    const checkEnumMatches = (fieldInfo, targetEnums) => {
      const currentEnums = fieldInfo.type
        .toString()
        .replace(/enum\(|\)/g, "")
        .split(/['",\s]+/)
        .filter(v => v);
      return (
        currentEnums.length === targetEnums.length &&
        currentEnums.every(v => targetEnums.includes(v))
      );
    };

    // 修改 goods 表
    const goodsFields = await describeTable("goods");
    if (!goodsFields.originalPrice) {
      await queryInterface.addColumn("goods", "originalPrice", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: "商品原价",
      });
    } else if (
      !checkFieldMatches(
        goodsFields.originalPrice,
        Sequelize.DECIMAL(10, 2),
        false,
        "商品原价"
      )
    ) {
      await queryInterface.changeColumn("goods", "originalPrice", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: "商品原价",
      });
    }

    // 修改 member_goods 表
    const memberGoodsFields = await describeTable("member_goods");

    // discount_type
    if (!memberGoodsFields.discount_type) {
      await queryInterface.addColumn("member_goods", "discount_type", {
        type: Sequelize.ENUM(
          "exchange",
          "special offer",
          "Presale",
          "group buy"
        ),
        allowNull: true,
        comment: "折扣类型",
      });
    } else {
      const targetEnums = ["exchange", "special offer", "Presale", "group buy"];
      if (
        !checkFieldMatches(
          memberGoodsFields.discount_type,
          Sequelize.ENUM(...targetEnums),
          true,
          "折扣类型"
        ) ||
        !checkEnumMatches(memberGoodsFields.discount_type, targetEnums)
      ) {
        await queryInterface.changeColumn("member_goods", "discount_type", {
          type: Sequelize.ENUM(
            "exchange",
            "special offer",
            "Presale",
            "group buy"
          ),
          allowNull: true,
          comment: "折扣类型",
        });
      }
    }

    // discount_tag
    if (!memberGoodsFields.discount_tag) {
      await queryInterface.addColumn("member_goods", "discount_tag", {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: "折扣标签",
      });
    } else if (
      !checkFieldMatches(
        memberGoodsFields.discount_tag,
        Sequelize.STRING(100),
        true,
        "折扣标签"
      )
    ) {
      await queryInterface.changeColumn("member_goods", "discount_tag", {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: "折扣标签",
      });
    }

    // 修改 promotion 表
    const promotionFields = await describeTable("promotion");

    if (!promotionFields.activity_type) {
      await queryInterface.addColumn("promotion", "activity_type", {
        type: Sequelize.ENUM(
          "限时抢购",
          "季节性",
          "联名定制",
          "大促专属",
          "赶圩",
          "团购特价",
          "临时特价"
        ),
        allowNull: false,
        comment: "活动类型",
      });
    } else {
      const targetEnums = [
        "限时抢购",
        "季节性",
        "联名定制",
        "大促专属",
        "赶圩",
        "团购特价",
        "临时特价",
      ];
      if (
        !checkFieldMatches(
          promotionFields.activity_type,
          Sequelize.ENUM(...targetEnums),
          false,
          "活动类型"
        ) ||
        !checkEnumMatches(promotionFields.activity_type, targetEnums)
      ) {
        await queryInterface.changeColumn("promotion", "activity_type", {
          type: Sequelize.ENUM(
            "限时抢购",
            "季节性",
            "联名定制",
            "大促专属",
            "赶圩",
            "团购特价",
            "临时特价"
          ),
          allowNull: false,
          comment: "活动类型",
        });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // 回滚修改
    await queryInterface.removeColumn("goods", "originalPrice");
    await queryInterface.removeColumn("member_goods", "discount_type");
    await queryInterface.removeColumn("member_goods", "discount_tag");
    await queryInterface.changeColumn("promotion", "activity_type", {
      type: Sequelize.ENUM("限时抢购", "季节性", "联名定制", "大促专属"),
      allowNull: false,
    });
  },
};
