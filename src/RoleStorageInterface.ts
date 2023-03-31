import { Role } from "./PermissionManager";

/**
 * A storage for RBAC roles used in {@see Manager}.
 **/
export interface RoleStorageInterface {
  /**
   * Removes all roles.
   */
  clear(): void;

  /**
   * Returns all roles in the system.
   *
   * @return Role[] All roles in the system.
   */
  getAll(): Role[];

  /**
   * Returns the named role.
   *
   * @param name The role name.
   *
   * @return The role corresponding to the specified name. `undefined` is returned if no such item.
   */
  get(name: string): Role | undefined;

  /**
   * Returns whether named role exists.
   *
   * @param name The role name.
   *
   * @return Whether named role exists.
   */
  exists(name: string): boolean;

  /**
   * Adds the role to RBAC system.
   *
   * @param item The role to add.
   */
  add(item: Role): void;

  // /**
  //  * Updates the specified role in the system.
  //  *
  //  * @param name The old name of the role.
  //  * @param item Modified role.
  //  */
  // update(name: string, item: Role): void;

  /**
   * Removes a role from the RBAC system.
   *
   * @param name Name of a role or a permission to remove.
   */
  remove(name: string): void;
}
