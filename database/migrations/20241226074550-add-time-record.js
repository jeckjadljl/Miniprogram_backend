"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING, DATE, BIGINT } = Sequelize;

    // 开启事务
    await queryInterface.sequelize.transaction(async transaction => {
      // `goods` 表的更改
      const goodsTable = await queryInterface.describeTable("goods");
      if (goodsTable.created_at) {
        await queryInterface.removeColumn("goods", "created_at", {
          transaction,
        });
        await queryInterface.addColumn(
          "goods",
          "createdTime",
          {
            type: DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          { transaction }
        );
      }
      if (goodsTable.updated_at) {
        await queryInterface.removeColumn("goods", "updated_at", {
          transaction,
        });
      }
      if (!goodsTable.version) {
        await queryInterface.addColumn(
          "goods",
          "version",
          {
            type: BIGINT,
            defaultValue: 0,
          },
          { transaction }
        );
      }

      // `merchant` 表的更改
      await queryInterface.removeColumn("merchant", "createdAt", {
        transaction,
      });
      await queryInterface.addColumn(
        "merchant",
        "createdTime",
        {
          type: DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        { transaction }
      );
      await queryInterface.removeColumn("merchant", "updatedAt", {
        transaction,
      });
      await queryInterface.addColumn(
        "merchant",
        "version",
        {
          type: BIGINT,
          defaultValue: 0,
        },
        { transaction }
      );

      // `order_items` 表的更改
      await queryInterface.removeColumn("order_items", "created_at", {
        transaction,
      });
      await queryInterface.removeColumn("order_items", "updated_at", {
        transaction,
      });

      // `payments` 表的更改
      await queryInterface.removeColumn("payments", "created_at", {
        transaction,
      });
      await queryInterface.removeColumn("payments", "updated_at", {
        transaction,
      });
      await queryInterface.addColumn(
        "payments",
        "version",
        {
          type: BIGINT,
          defaultValue: 0,
        },
        { transaction }
      );
      await queryInterface.renameColumn("payments", "payment_time", "payTime", {
        transaction,
      });
      await queryInterface.changeColumn(
        "payments",
        "payTime",
        {
          type: DATE,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "payments",
        "orderBillNumber",
        {
          type: STRING(38),
        },
        { transaction }
      );

      // `points` 表的更改
      await queryInterface.renameColumn("points", "created_at", "createdTime", {
        transaction,
      });

      // `referrals` 表的更改
      await queryInterface.renameColumn(
        "referrals",
        "createdAt",
        "createdTime",
        { transaction }
      );
      await queryInterface.addColumn(
        "referrals",
        "lastModifiedTime",
        {
          type: DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        { transaction }
      );

      // `rewards` 表的更改
      await queryInterface.renameColumn(
        "rewards",
        "created_at",
        "createdTime",
        {
          transaction,
        }
      );

      // `permissions` 表的更改
      await queryInterface.addColumn(
        "permissions",
        "createdTime",
        {
          type: DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        { transaction }
      );

      // `role_permissions` 表的更改
      await queryInterface.renameColumn(
        "role_permissions",
        "created_at",
        "createdTime",
        { transaction }
      );

      // `user_roles` 表的更改
      await queryInterface.renameColumn(
        "user_roles",
        "created_at",
        "createdTime",
        { transaction }
      );

      // `role` 表的更改
      await queryInterface.addColumn(
        "role",
        "createdTime",
        {
          type: DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        { transaction }
      );

      // `user` 表的更改
      await queryInterface.renameColumn("user", "createdAt", "createdTime", {
        transaction,
      });
      await queryInterface.renameColumn(
        "user",
        "updatedAt",
        "lastModifiedTime",
        { transaction }
      );

      // `vouchers` 表的更改
      await queryInterface.renameColumn(
        "vouchers",
        "created_at",
        "createdTime",
        {
          transaction,
        }
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      // 和 `up` 方法中的更改逻辑相反，逐一撤销修改
      const goodsTable = await queryInterface.describeTable("goods");
      if (goodsTable.createdTime) {
        await queryInterface.removeColumn("goods", "createdTime", {
          transaction,
        });
        await queryInterface.addColumn(
          "goods",
          "created_at",
          {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          { transaction }
        );
      }
      if (!goodsTable.updated_at) {
        await queryInterface.addColumn(
          "goods",
          "updated_at",
          {
            type: Sequelize.DATE,
          },
          { transaction }
        );
      }
      if (goodsTable.version) {
        await queryInterface.removeColumn("goods", "version", { transaction });
      }

      const merchantTable = await queryInterface.describeTable("merchant");
      if (merchantTable.createdTime) {
        await queryInterface.removeColumn("merchant", "createdTime", {
          transaction,
        });
        await queryInterface.addColumn(
          "merchant",
          "createdAt",
          {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          { transaction }
        );
      }
      if (!merchantTable.updatedAt) {
        await queryInterface.addColumn(
          "merchant",
          "updatedAt",
          {
            type: Sequelize.DATE,
          },
          { transaction }
        );
      }
      if (merchantTable.version) {
        await queryInterface.removeColumn("merchant", "version", {
          transaction,
        });
      }

      const orderItemsTable = await queryInterface.describeTable("order_items");
      if (!orderItemsTable.created_at) {
        await queryInterface.addColumn(
          "order_items",
          "created_at",
          {
            type: Sequelize.DATE,
          },
          { transaction }
        );
      }
      if (!orderItemsTable.updated_at) {
        await queryInterface.addColumn(
          "order_items",
          "updated_at",
          {
            type: Sequelize.DATE,
          },
          { transaction }
        );
      }

      const paymentsTable = await queryInterface.describeTable("payments");
      if (!paymentsTable.created_at) {
        await queryInterface.addColumn(
          "payments",
          "created_at",
          {
            type: Sequelize.DATE,
          },
          { transaction }
        );
      }
      if (!paymentsTable.updated_at) {
        await queryInterface.addColumn(
          "payments",
          "updated_at",
          {
            type: Sequelize.DATE,
          },
          { transaction }
        );
      }
      if (paymentsTable.version) {
        await queryInterface.removeColumn("payments", "version", {
          transaction,
        });
      }
      if (paymentsTable.payTime) {
        await queryInterface.renameColumn(
          "payments",
          "payTime",
          "payment_time",
          { transaction }
        );
      }
      if (paymentsTable.payment_time) {
        await queryInterface.changeColumn(
          "payments",
          "payment_time",
          {
            type: Sequelize.DATE,
          },
          { transaction }
        );
      }
      if (paymentsTable.orderBillNumber) {
        await queryInterface.removeColumn("payments", "orderBillNumber", {
          transaction,
        });
      }

      const pointsTable = await queryInterface.describeTable("points");
      if (pointsTable.createdTime) {
        await queryInterface.renameColumn(
          "points",
          "createdTime",
          "created_at",
          { transaction }
        );
      }

      const referralsTable = await queryInterface.describeTable("referrals");
      if (referralsTable.createdTime) {
        await queryInterface.renameColumn(
          "referrals",
          "createdTime",
          "createdAt",
          { transaction }
        );
      }
      if (referralsTable.lastModifiedTime) {
        await queryInterface.removeColumn("referrals", "lastModifiedTime", {
          transaction,
        });
      }

      const rewardsTable = await queryInterface.describeTable("rewards");
      if (rewardsTable.createdTime) {
        await queryInterface.renameColumn(
          "rewards",
          "createdTime",
          "created_at",
          { transaction }
        );
      }

      const permissionsTable = await queryInterface.describeTable(
        "permissions"
      );
      if (permissionsTable.createdTime) {
        await queryInterface.removeColumn("permissions", "createdTime", {
          transaction,
        });
      }

      const rolePermissionsTable = await queryInterface.describeTable(
        "role_permissions"
      );
      if (rolePermissionsTable.createdTime) {
        await queryInterface.renameColumn(
          "role_permissions",
          "createdTime",
          "created_at",
          {
            transaction,
          }
        );
      }

      const userRolesTable = await queryInterface.describeTable("user_roles");
      if (userRolesTable.createdTime) {
        await queryInterface.renameColumn(
          "user_roles",
          "createdTime",
          "created_at",
          { transaction }
        );
      }

      const roleTable = await queryInterface.describeTable("role");
      if (roleTable.createdTime) {
        await queryInterface.removeColumn("role", "createdTime", {
          transaction,
        });
      }

      const userTable = await queryInterface.describeTable("user");
      if (userTable.createdTime) {
        await queryInterface.renameColumn("user", "createdTime", "createdAt", {
          transaction,
        });
      }
      if (userTable.lastModifiedTime) {
        await queryInterface.renameColumn(
          "user",
          "lastModifiedTime",
          "updatedAt",
          { transaction }
        );
      }

      const vouchersTable = await queryInterface.describeTable("vouchers");
      if (vouchersTable.createdTime) {
        await queryInterface.renameColumn(
          "vouchers",
          "createdTime",
          "created_at",
          { transaction }
        );
      }
    });
  },
};
