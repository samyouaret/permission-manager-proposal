import { ManagerInterface, Role, Permission } from "yii-rbac";

class AuthUtility {
  private authManager: ManagerInterface;

  constructor(authManager: ManagerInterface) {
    this.authManager = authManager;
  }

  public createItem(name: string, type: number = 1): Role | Permission {
    if (type === 1) {
      return this.authManager.createRole(name);
    }

    return this.authManager.createPermission(name);
  }

  public getItemByType(name: string, type: number = 1): Role | Permission {
    if (type === 1) {
      return this.authManager.getRole(name);
    }

    return this.authManager.getPermission(name);
  }

  public getItem(name: string): Role | Permission | null {
    return (
      this.authManager.getPermission(name) ?? this.authManager.getRole(name)
    );
  }

  public createItems(itemsNames: string[]): (Role | Permission)[] {
    const items: (Role | Permission)[] = [];
    for (const name of itemsNames) {
      this.itemNotExistsGuard(name);
      const item = this.getItem(name);
      const newItem = this.createItem(name, item?.type);
      items.push(newItem);
    }

    return items;
  }

  public createPermissionsItems(itemsNames: string[]): Permission[] {
    const items: Permission[] = [];
    for (const name of itemsNames) {
      this.itemExistsGuard(name);
      const newItem = this.createItem(name, 2) as Permission;
      items.push(newItem);
    }

    return items;
  }

  public addChildren(
    authItem: Role | Permission,
    children: (Role | Permission)[]
  ): void {
    for (const child of children) {
      this.authManager.addChild(authItem, child);
    }
  }

  public assignMany(items: (Role | Permission)[], userId: any): void {
    for (const item of items) {
      this.authManager.assign(item, userId);
    }
  }

  public itemExists(name: string): boolean {
    return this.getItem(name) !== null;
  }

  public itemExistsGuard(name: string): void {
    if (this.itemExists(name)) {
      throw new Error(`Permission/Role '${name}' already exists.`);
    }
  }

  public itemNotExistsGuard(name: string): void {
    if (!this.itemExists(name)) {
      throw new Error(`Permission/Role '${name}' does not exist.`);
    }
  }

  public CanUpdateItemGuard(
    name: string,
    newName: string,
    children: (Role | Permission)[]
  ): void {
    this.childIsNotParentGuard(name, children);
    if (name !== newName) {
      this.itemExistsGuard(newName);
    }
  }

  public childIsNotParentGuard(
    name: string,
    childNames: (Role | Permission)[] | string[]
  ): void {
    for (const child of childNames) {
      if (name === child) {
        throw new Error(
          `Permission/Role '${name}' cannot include itself as a child.`
        );
      }
    }
  }

  public correctRelationshipGuard(
    parent: Role | Permission,
    children: (Role | Permission)[]
  ): void {
    for (const child of children) {
      if (!this.authManager.canAddChild(parent, child)) {
        throw new Error(
          `Permission/Role '${parent.name}' cannot include ${child.name} as a child.`
        );
      }
    }
  }

  public getAuthManager(): ManagerInterface {
    return this.authManager;
  }
}
