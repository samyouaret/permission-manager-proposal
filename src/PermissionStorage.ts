import { PermissionType, Role } from "./PermissionManager";
/**
 * A storage for RBAC roles and permissions used in {@see Manager}.
 **/

export interface PermissionTypeStorageInterface {
  /**
   * Removes all roles and permissions.
   */
  clear(): void;

  /**
   * Returns all roles and permissions in the system.
   *
   * @return PermissionType] All roles and permissions in the system.
   */
  getAll(): PermissionType[];

  /**
   * Returns the named role or permission.
   *
   * @param name The role or the permission name.
   *
   * @return The role or the permission corresponding to the specified name. `null` is returned if no such item.
   */
  get(name: string): PermissionType | undefined;

  /**
   * Returns whether named role or permission exists.
   *
   * @param name The role or the permission name.
   *
   * @return Whether named role or permission exists.
   */
  exists(name: string): boolean;

  /**
   * Adds the role or the permission to RBAC system.
   *
   * @param item The role or the permission to add.
   */
  add(item: PermissionType): void;

  /**
   * Updates the specified role or permission in the system.
   *
   * @param name The old name of the role or permission.
   * @param item Modified role or permission.
   */
  update(name: string, item: PermissionType): void;

  /**
   * Removes a role or permission from the RBAC system.
   *
   * @param name Name of a role or a permission to remove.
   */
  remove(name: string): void;

  /**
   * Returns all roles in the system.
   *
   * @return All roles in the system.
   */
  getRoles(): Role[];

  /**
   * Returns the named role.
   *
   * @param name The role name.
   *
   * @return The role corresponding to the specified name. `null` is returned if no such role.
   */
  getRole(name: string): Role | undefined;

  /**
   * Removes all roles.
   * All parent child relations will be adjusted accordingly.
   */
  clearRoles(): void;

  /**
   * Returns all permissions in the system.
   *
   * @return All permissions in the system.
   */
  getPermissions(): PermissionType[];

  /**
   * Returns the named permission.
   *
   * @param name The permission name.
   *
   * @return The permission corresponding to the specified name. `null` is returned if no such permission.
   */
  getPermission(name: string): PermissionType | undefined;

  /**
   * Removes all permissions.
   * All parent child relations will be adjusted accordingly.
   */
  clearPermissions(): void;

  /**
   * Returns the parent Roles.
   * @return The parent Roles.
   */
  getParents(name: string): Role[];

  /**
   * Returns the attached permission to role.
   *
   * @param name The parent name.
   *
   * @return The attached permission to role.
   */
  getPermissions(roleName: string): PermissionType[];

  /**
   * Returns whether named parent has children.
   *
   * @param name The parent name.
   *
   * @return Whether named parent has children.
   */
  hasPermission(name: string): boolean;

  /**
   * Adds a role or a permission as a child of another role or permission.
   *
   * @param parentName Name of the parent to add child to.
   * @param childName Name of the child to
   */
  addPermission(parentName: string, childName: string): void;

  removePermission(parentName: string, childName: string): void;

  removeAllPermissions(parentName: string): void;
}
