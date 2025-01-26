"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { DATE, BIGINT } = Sequelize;
    await queryInterface.sequelize.transaction(async transaction => {
      const permissionsTable = await queryInterface.describeTable(
        "permissions"
      );
      if (!permissionsTable.lastModifiedTime) {
        await queryInterface.addColumn(
          "permissions",
          "lastModifiedTime",
          {
            type: DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          { transaction }
        );
      }
      if (!permissionsTable.version) {
        await queryInterface.addColumn(
          "permissions",
          "version",
          {
            type: BIGINT,
            defaultValue: 0,
          },
          { transaction }
        );
      }

      const roleTable = await queryInterface.describeTable("role");
      if (!roleTable.lastModifiedTime) {
        await queryInterface.addColumn(
          "role",
          "lastModifiedTime",
          {
            type: DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          { transaction }
        );
      }
      if (!roleTable.version) {
        await queryInterface.addColumn(
          "role",
          "version",
          {
            type: BIGINT,
            defaultValue: 0,
          },
          { transaction }
        );
      }

      const voucherRulesTable = await queryInterface.describeTable(
        "voucher_rules"
      );
      if (!voucherRulesTable.createdTime) {
        await queryInterface.addColumn(
          "voucher_rules",
          "createdTime",
          {
            type: DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          { transaction }
        );
      }
      if (!voucherRulesTable.lastModifiedTime) {
        await queryInterface.addColumn(
          "voucher_rules",
          "lastModifiedTime",
          {
            type: DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          { transaction }
        );
      }
      if (!permissionsTable.version) {
        await queryInterface.addColumn(
          "voucher_rules",
          "version",
          {
            type: BIGINT,
            defaultValue: 0,
          },
          { transaction }
        );
      }

      const vouchersTable = await queryInterface.describeTable("vouchers");
      if (!vouchersTable.lastModifiedTime) {
        await queryInterface.addColumn(
          "vouchers",
          "lastModifiedTime",
          {
            type: DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          { transaction }
        );
      }
      if (!permissionsTable.version) {
        await queryInterface.addColumn(
          "vouchers",
          "version",
          {
            type: BIGINT,
            defaultValue: 0,
          },
          { transaction }
        );
      }

      const userRolesTable = await queryInterface.describeTable("user_roles");
      if (!userRolesTable.lastModifiedTime) {
        await queryInterface.addColumn(
          "user_roles",
          "lastModifiedTime",
          {
            type: DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          { transaction }
        );
      }
      if (!userRolesTable.version) {
        await queryInterface.addColumn(
          "user_roles",
          "version",
          {
            type: BIGINT,
            defaultValue: 0,
          },
          { transaction }
        );
      }

      const rolePermissionsTable = await queryInterface.describeTable(
        "role_permissions"
      );
      if (!rolePermissionsTable.lastModifiedTime) {
        await queryInterface.addColumn(
          "role_permissions",
          "lastModifiedTime",
          {
            type: DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          { transaction }
        );
      }
      if (!rolePermissionsTable.version) {
        await queryInterface.addColumn(
          "role_permissions",
          "version",
          {
            type: BIGINT,
            defaultValue: 0,
          },
          { transaction }
        );
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn("permissions", "lastModifiedTime", {
        transaction,
      });
      await queryInterface.removeColumn("permissions", "version", {
        transaction,
      });

      await queryInterface.removeColumn("role", "lastModifiedTime", {
        transaction,
      });
      await queryInterface.removeColumn("role", "version", { transaction });

      await queryInterface.removeColumn("voucher_rules", "createdTime", {
        transaction,
      });
      await queryInterface.removeColumn("voucher_rules", "lastModifiedTime", {
        transaction,
      });
      await queryInterface.removeColumn("voucher_rules", "version", {
        transaction,
      });

      await queryInterface.removeColumn("vouchers", "lastModifiedTime", {
        transaction,
      });
      await queryInterface.removeColumn("vouchers", "version", { transaction });

      await queryInterface.removeColumn("user_roles", "lastModifiedTime", {
        transaction,
      });
      await queryInterface.removeColumn("user_roles", "version", {
        transaction,
      });

      await queryInterface.removeColumn(
        "role_permissions",
        "lastModifiedTime",
        { transaction }
      );
      await queryInterface.removeColumn("role_permissions", "version", {
        transaction,
      });
    });
  },
};
