import { PermissionType } from "../PermissionManager";
/**
 * A storage for RBAC permissions used in {@see Manager}.
**/

export interface PermissionStorageInterface {
  /**
   * Removes all permissions.
   */
  clear(): void;

  /**
   * Returns all permissions in the system.
   *
   * @return PermissionType] All permissions in the system.
   */
  getAll(): PermissionType[];

  /**
   * Returns the named permission.
   *
   * @param name The the permission name.
   *
   * @return The the permission corresponding to the specified name. `null` is returned if no such permission.
   */
  get(name: string): PermissionType | undefined;

  /**
   * Returns whether named permission exists.
   *
   * @param name The the permission name.
   *
   * @return Whether named permission exists.
   */
  exists(name: string): boolean;

  /**
   * Adds the the permission to RBAC system.
   *
   * @param permission The the permission to add.
   */
  add(permission: PermissionType): PermissionType;

  /**
   * Updates the specified permission in the system.
   *
   * @param name The old name of the permission.
   * @param permission Modified permission.
   */
  update(name: string, permission: PermissionType): void;

  /**
   * Removes a permission from the RBAC system.
   *
   * @param name Name of a a permission to remove.
   */
  remove(name: string): void;
}