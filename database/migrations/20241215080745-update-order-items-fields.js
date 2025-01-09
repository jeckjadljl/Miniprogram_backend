"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 新增字段
    const orderItemsTable = await queryInterface.describeTable("order_items");

    // 3. 保留原字段，但它们不再是主键
    await queryInterface.changeColumn("order_items", "order_id", {
      type: Sequelize.STRING(38),
      allowNull: false,
    });
    await queryInterface.changeColumn("order_items", "goods_id", {
      type: Sequelize.STRING(38),
      allowNull: false,
    });

    if (!orderItemsTable.uuid) {
      await queryInterface.addColumn("order_items", "uuid", {
        type: Sequelize.STRING(38),
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        comment: "唯一标识符",
      });
      await queryInterface.addConstraint("order_items", {
        fields: ["uuid"],
        type: "primary key",
        name: "order_items_uuid_pkey",
      });
    }

    await queryInterface.addColumn("order_items", "name", {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: "商品名称",
    });

    await queryInterface.addColumn("order_items", "thumbnail", {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "商品主图地址",
    });

    await queryInterface.addColumn("order_items", "unitName", {
      type: Sequelize.STRING(20),
      allowNull: false,
      comment: "商品单位名称（如件、包）",
    });

    await queryInterface.renameColumn("order_items", "price", "salePrice");

    await queryInterface.addColumn("order_items", "spec", {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "商品规格信息（如颜色、尺寸）",
    });

    // 新增字段
    await queryInterface.renameColumn("orders", "order_id", "uuid");

    await queryInterface.addColumn("orders", "freight_amount", {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0.0,
      comment: "运费金额",
    });

    await queryInterface.addColumn("orders", "payment_amount", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      comment: "用户实际支付的金额",
    });

    await queryInterface.addColumn("orders", "discount_amount", {
      type: Sequelize.DECIMAL(10, 2),
      comment: "优惠金额",
    });

    await queryInterface.addColumn("orders", "billNumber", {
      type: Sequelize.STRING(38),
      allowNull: false,
      comment: "订单编号",
    });

    // 修改字段值的范围
    await queryInterface.changeColumn("orders", "order_status", {
      type: Sequelize.ENUM(
        "initial",
        "paid",
        "shipped",
        "completed",
        "canceled"
      ),
      comment: "订单状态",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 回滚新增字段
    await queryInterface.removeColumn("order_items", "uuid");
    await queryInterface.removeColumn("order_items", "name");
    await queryInterface.removeColumn("order_items", "thumbnail");
    await queryInterface.removeColumn("order_items", "unitName");
    await queryInterface.removeColumn("order_items", "salePrice");
    await queryInterface.removeColumn("order_items", "spec");

    // 恢复被删除的字段
    await queryInterface.renameColumn("order_items", "salePrice", "price");

    // 2. 恢复原组合主键
    await queryInterface.addConstraint("order_items", {
      fields: ["order_id", "goods_id"],
      type: "primary key",
      name: "order_items_pkey",
    });

    // 回滚新增字段
    await queryInterface.renameColumn("orders", "uuid", "order_id");
    await queryInterface.removeColumn("orders", "freight_amount");
    await queryInterface.removeColumn("orders", "payment_amount");
    await queryInterface.removeColumn("orders", "discount_amount");
    await queryInterface.removeColumn("orders", "billNumber");

    // 回滚修改的字段值范围
    await queryInterface.changeColumn("orders", "order_status", {
      type: Sequelize.ENUM(
        "initial",
        "delivery",
        "shipped",
        "evaluated",
        "canceled"
      ),
      comment: "订单状态",
    });
  },
};
