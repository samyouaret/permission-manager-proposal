import { PermissionStorageInterface } from "../contracts/PermissionStorageInterface";
import { PermissionType } from "../PermissionManager";

export class PermissionStorage implements PermissionStorageInterface {
  private permissions: Map<string, PermissionType>;

  constructor() {
    this.permissions = new Map();
  }
  async clear(): Promise<void> {
    this.permissions.clear();
  }

  async getAll(): Promise<PermissionType[]> {
    return Array.from(this.permissions.values());
  }

  async get(name: string): Promise<PermissionType | undefined> {
    return this.permissions.get(name);
  }

  async exists(name: string): Promise<boolean> {
    return this.permissions.has(name);
  }

  async add(permission: PermissionType): Promise<PermissionType> {
    this.permissions.set(permission.name, permission);
    return permission;
  }

  async update(name: string, item: PermissionType): Promise<void> {
    if ((await this.exists(name)) == false) {
      throw new Error("Permission does not exist");
    }
    // if new name is different from old name
    // throw error if new name already exists
    // delete old name
    if (name !== item.name) {
      if ((await this.exists(item.name)) == false) {
        throw new Error(`Permission with name ${item.name} already  exists`);
      }
      this.permissions.delete(name);
    }

    this.permissions.set(name, item);
  }

  async remove(name: string): Promise<void> {
    if ((await this.exists(name)) == false) {
      throw new Error("Permission does not exist");
    }

    this.permissions.delete(name);
  }
}

async function main() {
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

  await permissionStorage.add(newPermission);

  console.log(await permissionStorage.getAll());
  console.log(await permissionStorage.exists("createPost"));
  await permissionStorage.remove("createPost");
  console.log(await permissionStorage.exists("createPost"));
  await permissionStorage.clear();
  console.log(await permissionStorage.getAll());
}
