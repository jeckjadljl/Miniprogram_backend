const Service = require("egg").Service;
const UUID = require("uuid").v4;

class RoleService extends Service {
  /**
   * @description Get all permissions for a specific user.
   * @param {String} userId - The ID of the user whose permissions are to be retrieved.
   * @return {Promise<Array>} A promise that resolves to an array of permissions.
   */
  async getUserRoles(userId) {
    const { ctx } = this;
    try {
      // 查询用户的所有角色关联
      const userRoles = await ctx.model.UserRoles.getUserRoles(userId);

      if (!userRoles || userRoles.length === 0) {
        throw new Error("Roles not found");
      }

      return userRoles;
    } catch (error) {
      this.ctx.logger.error("Error getting user roles:", error);
      throw error;
    }
  }

  /**
   *
   * @param {object} userid 用户的uuid
   * @param {object} roleid 角色的id
   * @return {object|null} - 关联的结果
   */
  async UserRoles(userId, roleId) {
    const { ctx } = this;
    const userRoles = await ctx.model.UserRoles.add({ userId, roleId });
    return userRoles;
  }

  /**
   *
   * @param {object} roleid 角色的id
   * @param {object} permissionid 权限的id
   * @return {object|null} - 关联的结果
   */
  async RolePermissions(roleid, permissionid) {
    const { ctx } = this;
    const rolePermissions = await ctx.model.RolePermissions.findOrCreate({
      where: {
        role_id: roleid,
        permission_id: permissionid,
      },
      defaults: {
        id: UUID(),
      },
    });
    return rolePermissions;
  }

  /**
   * @description Find a role by its ID.
   * @param {String} roleId - The unique identifier of the role.
   * @return {Promise<Document>} A promise resolving to the role document.
   */
  async findRoleById(roleId) {
    try {
      const role = await this.ctx.model.Role.findByPk(roleId);
      return role || null;
    } catch (error) {
      this.ctx.logger.error(`Find role by ID failed: ${error}`);
      throw error;
    }
  }

  /**
   * @description Locate a role by its name.
   * @param {String} roleName - The name of the role.
   * @return {Promise<Document>} A promise resolving to the found role document.
   */
  async findRoleByName(roleName) {
    try {
      return this.ctx.model.Role.get(roleName);
    } catch (error) {
      this.ctx.logger.error(`Find role by roleName failed: ${error}`);
      throw error;
    }
  }

  /**
   * @description List all roles available in the system.
   * @return {Promise<Array>} A promise resolving to an array of role documents.
   */
  async listRoles() {
    return this.ctx.model.Role.find({});
  }

  /**
   * @description Update the information associated with a role.
   * @param {String} roleId - The unique identifier of the role.
   * @param {Object} updateData - An object containing the new role data.
   * @return {Promise<Document>} A promise resolving to the updated role document.
   */
  async updateRole(roleId, updateData) {
    try {
      const role = await this.ctx.model.Role.findByPk(roleId);
      if (!role) {
        throw new Error("Role not found");
      }
      await role.update(updateData);
      return role;
    } catch (error) {
      this.ctx.logger.error(`Failed to update role: ${error}`);
    }
  }

  /**
   * @description Delete a role from the system.
   * @param {String} roleId - The unique identifier of the role to be deleted.
   * @return {Promise<Document>} A promise resolving to the document of the deleted role.
   */
  async deleteRole(roleId) {
    try {
      const role = await this.ctx.model.Role.findByPk(roleId);
      if (!role) {
        throw new Error("Role not found");
      }
      await role.destroy();
      return { message: `Role ${role.name} deleted successfully` };
    } catch (error) {
      this.ctx.logger.error(`Delete role failed: ${error}`);
      throw error;
    }
  }
}

module.exports = RoleService;
