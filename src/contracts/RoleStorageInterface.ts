export interface Role {
  name: string;
}

/**
 * A storage for RBAC roles used in {@see Manager}.
 **/
export interface RoleStorageInterface {
  /**
   * Removes all roles.
   */
  clear(): Promise<void>;

  /**
   * Returns all roles in the system.
   *
   * @return Role[] All roles in the system.
   */
  getAll(): Promise<Role[]>;

  /**
   * Returns the named role.
   *
   * @param name The role name.
   *
   * @return The role corresponding to the specified name. `undefined` is returned if no such item.
   */
  get(name: string): Promise<Role | undefined>;

  /**
   * Returns whether named role exists.
   *
   * @param name The role name.
   *
   * @return Whether named role exists.
   */
  exists(name: string): Promise<boolean>;

  /**
   * Adds the role to RBAC system.
   *
   * @param item The role to add.
   */
  add(item: Role): Promise<void>;

  // /**
  //  * Updates the specified role in the system.
  //  *
  //  * @param name The old name of the role.
  //  * @param item Modified role.
  //  */
  // update(name: string, item: Role): Promise<void>;

  /**
   * Removes a role from the RBAC system.
   *
   * @param name Name of a role or a permission to remove.
   */
  remove(name: string): Promise<void>;
}