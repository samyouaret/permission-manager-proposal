import { RolePermissionsStorageInterface } from "../contracts/RolePermissionsStorageInterface";
import { PermissionType } from "../PermissionManager";

export class RolePermissionsStorage implements RolePermissionsStorageInterface {
  private RolePermissions: Map<string, Map<string, PermissionType>>;

  constructor() {
    this.RolePermissions = new Map();
  }

  hasPermission(PermissionName: string): boolean {
    for (const [_roleName, permissions] of this.RolePermissions) {
      if (permissions.has(PermissionName)) {
        return true;
      }
    }
    return false;
  }

  clear(roleName: string): void {
    this.RolePermissions.delete(roleName);
  }

  getAll(roleName: string): PermissionType[] {
    const permissions = this.RolePermissions.get(roleName);
    if (permissions) {
      return Array.from(permissions.values());
    }

    return [];
  }

  has(roleName: string, PermissionName: string): boolean {
    const permissions = this.RolePermissions.get(roleName);
    if (permissions) {
      return permissions.has(PermissionName);
    }
    return false;
  }

  add(roleName: string, permission: PermissionType): void {
    const permissions = this.RolePermissions.get(roleName);
    if (permissions) {
      permissions.set(permission.name, permission);
    } else {
      const newPermissions = new Map<string, PermissionType>();
      newPermissions.set(permission.name, permission);
      this.RolePermissions.set(roleName, newPermissions);
    }
  }

  remove(roleName: string, permissionName: string): void {
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

const rolePermissionsStorage = new RolePermissionsStorage();

rolePermissionsStorage.add("admin", newPermission);

console.log(rolePermissionsStorage.getAll("admin"));

console.log(rolePermissionsStorage.has("admin", "createPost"));

rolePermissionsStorage.add("admin", {
  name: "UpdatePost",
  action: "UpdatePost",
  subject: "Post",
  conditions: {
    isPublished: true,
  },
  inverted: false,
  reason: "Post is not published",
});

console.log(rolePermissionsStorage.getAll("admin"));

rolePermissionsStorage.remove("admin", "createPost");

console.log(rolePermissionsStorage.getAll("admin"));
