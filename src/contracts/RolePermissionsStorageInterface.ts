import { PermissionType, Role } from "../PermissionManager";

/**
 * A storage for Roles Permissions.
 **/
export interface RolePermissionsStorageInterface {
  /**
   * Removes all roles.
   */
  clear(roleName: string): void;

  /**
   * Returns all roles in the system.
   *
   * @return Role[] All roles in the system.
   */
  getAll(roleName: string): PermissionType[];

  /**
   * Returns whether role has permission.
   *
   * @param name The role name.
   *
   * @return Whether role has permission.
   */
  has(roleName: string, PermissionName: string): boolean;

  /**
   * Adds the permission to role.
   *
   * @param item The role to add.
   */
  add(roleName: string, permission: PermissionType): void;

  /**
   * Removes a permission from the role.
   *
   * @param name Name of a role or a permission to remove.
   */
  remove(roleName: string, permissionName: string): void;
}
