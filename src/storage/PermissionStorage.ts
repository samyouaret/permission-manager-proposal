import { PermissionStorageInterface } from "../contracts/PermissionStorageInterface";
import { PermissionType } from "../PermissionManager";

export class PermissionStorage implements PermissionStorageInterface {
  private permissions: Map<string, PermissionType>;

  constructor() {
    this.permissions = new Map();
  }
  clear(): void {
    this.permissions.clear();
  }

  getAll(): PermissionType[] {
    return Array.from(this.permissions.values());
  }

  get(name: string): PermissionType | undefined {
    return this.permissions.get(name);
  }

  exists(name: string): boolean {
    return this.permissions.has(name);
  }

  add(permission: PermissionType): PermissionType {
    this.permissions.set(permission.name, permission);
    return permission;
  }

  update(name: string, item: PermissionType): void {
    if (this.exists(name) == false) {
      throw new Error("Permission does not exist");
    }
    // if new name is different from old name
    // throw error if new name already exists
    // delete old name
    if (name !== item.name) {
      if (this.exists(item.name) == false) {
        throw new Error(`Permission with name ${item.name} already  exists`);
      }
      this.permissions.delete(name);
    }

    this.permissions.set(name, item);
  }

  remove(name: string): void {
    if (this.exists(name) == false) {
      throw new Error("Permission does not exist");
    }

    this.permissions.delete(name);
  }
}

const permissionStorage = new PermissionStorage();

const newPermission = {
  name: "createPost",
  action: "createPost",
  subject: "User",
  conditions: {
    isAuthor: true,
  },
  inverted: false,
  reason: "You are not the author of the post",
};
permissionStorage.add(newPermission);

console.log(permissionStorage.getAll());
console.log(permissionStorage.exists("createPost"));
permissionStorage.remove("createPost");
console.log(permissionStorage.exists("createPost"));
permissionStorage.clear();
console.log(permissionStorage.getAll());
