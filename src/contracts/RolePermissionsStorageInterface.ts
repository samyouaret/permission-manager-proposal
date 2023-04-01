import { PermissionType, Role } from "../PermissionManager";

/**
 * A storage for Roles Permissions.
 **/
export interface RolePermissionsStorageInterface {
  /**
   * Removes all permissions from the role.
   */
  clear(roleName: string): Promise<void>;

  /**
   * Returns all permissions for the role.
   *
   * @return PermissionType[] All permissions for the role.
   */
  getAll(roleName: string): Promise<PermissionType[]>;

  /**
   * Returns whether the role has a permission.
   *
   * @param roleName The role name.
   * @param PermissionName The permission name.
   *
   * @return Whether the role has the permission.
   */
  has(roleName: string, PermissionName: string): Promise<boolean>;

  /**
   * Returns whether the permission is used by any role.
   *
   * @param name The permission name.
   *
   * @return Whether the permission is used by any role.
   */
  hasPermission(PermissionName: string): Promise<boolean>;

  /**
   * Adds the permission to the role.
   *
   * @param roleName The role name.
   * @param permission The permission to add.
   */
  add(roleName: string, permission: PermissionType): Promise<void>;

  /**
   * Removes a permission from the role.
   *
   * @param roleName The role name.
   * @param permissionName The permission name to remove.
   */
  remove(roleName: string, permissionName: string): Promise<void>;
}