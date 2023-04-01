import { RolePermissionsStorageInterface } from "../contracts/RolePermissionsStorageInterface";
import { PermissionType } from "../PermissionManager";

export class RolePermissionsStorage implements RolePermissionsStorageInterface {
  private RolePermissions: Map<string, Map<string, PermissionType>>;

  constructor() {
    this.RolePermissions = new Map();
  }

  async hasPermission(PermissionName: string): Promise<boolean> {
    for (const [_roleName, permissions] of this.RolePermissions) {
      if (permissions.has(PermissionName)) {
        return true;
      }
    }
    return false;
  }

  async clear(roleName: string): Promise<void> {
    this.RolePermissions.delete(roleName);
  }

  async getAll(roleName: string): Promise<PermissionType[]> {
    const permissions = this.RolePermissions.get(roleName);
    if (permissions) {
      return Array.from(permissions.values());
    }

    return [];
  }

  async has(roleName: string, PermissionName: string): Promise<boolean> {
    const permissions = this.RolePermissions.get(roleName);
    if (permissions) {
      return permissions.has(PermissionName);
    }
    return false;
  }

  async add(roleName: string, permission: PermissionType): Promise<void> {
    const permissions = this.RolePermissions.get(roleName);
    if (permissions) {
      permissions.set(permission.name, permission);
    } else {
      const newPermissions = new Map<string, PermissionType>();
      newPermissions.set(permission.name, permission);
      this.RolePermissions.set(roleName, newPermissions);
    }
  }

  async remove(roleName: string, permissionName: string): Promise<void> {
    const permissions = this.RolePermissions.get(roleName);
    if (permissions) {
      permissions.delete(permissionName);
    }
  }
}

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

async function main() {
  const rolePermissionsStorage = new RolePermissionsStorage();

  await rolePermissionsStorage.add("admin", newPermission);

  console.log(await rolePermissionsStorage.getAll("admin"));

  console.log(await rolePermissionsStorage.has("admin", "createPost"));

  await rolePermissionsStorage.add("admin", {
    name: "UpdatePost",
    action: "UpdatePost",
    subject: "Post",
    conditions: {
      isPublished: true,
    },
    inverted: false,
    reason: "Post is not published",
  });

  console.log(await rolePermissionsStorage.getAll("admin"));

  await rolePermissionsStorage.remove("admin", "createPost");

  console.log(await rolePermissionsStorage.getAll("admin"));
}
