import { PermissionType } from "../PermissionManager";
/**
 * A storage for RBAC permissions used in {@see Manager}.
 **/

export interface PermissionStorageInterface {
  /**
   * Removes all permissions.
   */
  clear(): Promise<void>;

  /**
   * Returns all permissions in the system.
   *
   * @return Promise<PermissionType[]> All permissions in the system.
   */
  getAll(): Promise<PermissionType[]>;

  /**
   * Returns the named permission.
   *
   * @param name The the permission name.
   *
   * @return Promise<PermissionType | undefined> The the permission corresponding to the specified name. `undefined` is returned if no such permission.
   */
  get(name: string): Promise<PermissionType | undefined>;

  /**
   * Returns whether named permission exists.
   *
   * @param name The the permission name.
   *
   * @return Promise<boolean> Whether named permission exists.
   */
  exists(name: string): Promise<boolean>;

  /**
   * Adds the the permission to RBAC system.
   *
   * @param permission The the permission to add.
   *
   * @return Promise<PermissionType> The added permission.
   */
  add(permission: PermissionType): Promise<PermissionType>;

  /**
   * Updates the specified permission in the system.
   *
   * @param name The old name of the permission.
   * @param permission Modified permission.
   *
   * @return Promise<void>
   */
  update(name: string, permission: PermissionType): Promise<void>;

  /**
   * Removes a permission from the RBAC system.
   *
   * @param name Name of a a permission to remove.
   *
   * @return Promise<void>
   */
  remove(name: string): Promise<void>;
}
