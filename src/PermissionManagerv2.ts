import { Ability, AbilityBuilder } from "@casl/ability";
import { AssignmentInterface } from "./contracts/AssignmentInterface";
import { AssignmentsStorageInterface } from "./contracts/AssignmentStorageInterface";
import {
  PermissionManagerInterface,
  PermissionType,
  UserType,
} from "./contracts/PermissionManagerInterface";
import { PermissionStorageInterface } from "./contracts/PermissionStorageInterface";
import { RolePermissionsStorageInterface } from "./contracts/RolePermissionsStorageInterface";
import { Role, RoleStorageInterface } from "./contracts/RoleStorageInterface";
import { AssignmentStorage } from "./storage/AssignmentStorage";
import { PermissionStorage } from "./storage/PermissionStorage";
import { RolePermissionsStorage } from "./storage/RolePermissionsStorage";
import { RoleStorage } from "./storage/RoleStorage";

class PermissionManagerv2 implements PermissionManagerInterface {
  constructor(
    private roleStorage: RoleStorageInterface,
    private permissionStorage: PermissionStorageInterface,
    private rolePermissionStorage: RolePermissionsStorageInterface,
    private assignStorage: AssignmentsStorageInterface
  ) {}

  createPermission(permission: PermissionType): PermissionType {
    this.permissionStorage.add(permission);

    return permission;
  }

  getPermission(name: string): PermissionType | undefined {
    return this.permissionStorage.get(name);
  }

  getRoles(): Role[] {
    return this.roleStorage.getAll();
  }

  getRole(name: string): Role | undefined {
    return this.roleStorage.get(name);
  }

  getPermissions(): PermissionType[] {
    return this.permissionStorage.getAll();
  }

  removePermission(name: string): void {
    // remove only if is not used by any role
    if (this.rolePermissionStorage.hasPermission(name)) {
      throw new Error("Permission is used by a role");
    }

    this.permissionStorage.remove(name);
  }

  createRole(name: string): Role {
    if (this.roleExists(name)) {
      throw new Error("Role already exists");
    }

    const role = { name };
    this.roleStorage.add(role);

    return role;
  }

  removeRole(name: string): void {
    if (this.roleExists(name) === false) {
      throw new Error("Role does not exist");
    }
    // remove only if is not used by any user
    if (this.assignStorage.hasRole(name)) {
      throw new Error("Role is used by a user");
    }

    this.roleStorage.remove(name);
  }

  attachPermission(role: Role, permission: PermissionType): void {
    if (this.permissionExists(permission.name) === false) {
      throw new Error("Permission does not exist");
    }
    // check if rolePermissionStorage already has the permission
    if (this.rolePermissionStorage.has(role.name, permission.name)) {
      throw new Error("Permission is already attached to the role");
    }

    this.rolePermissionStorage.add(role.name, permission);
  }

  DetachPermission(role: Role, permission: PermissionType): void {
    if (this.permissionExists(permission.name) === false) {
      throw new Error("Permission does not exist");
    }
    // check if rolePermissionStorage already has the permission
    if (this.rolePermissionStorage.has(role.name, permission.name) === false) {
      throw new Error("Permission is not attached to the role");
    }

    this.rolePermissionStorage.remove(role.name, permission.name);
  }

  removePermissions(role: Role): void {
    this.rolePermissionStorage.clear(role.name);
  }

  assign(role: Role, user: UserType): void {
    if (this.roleExists(role.name) === false) {
      throw new Error("Role does not exist");
    }

    this.assignStorage.add(user.id, role.name);
  }

  revoke(role: Role, user: UserType): void {
    if (this.roleExists(role.name) === false) {
      throw new Error("Role does not exist");
    }

    this.assignStorage.remove(role.name, user.id);
  }

  revokeAll(user: UserType): void {
    this.assignStorage.removeByUserId(user.id);
  }

  getAssignment(name: string, user: UserType): AssignmentInterface | undefined {
    return this.assignStorage.get(name, user.id);
  }

  permissionExists(name: string): boolean {
    return this.permissionStorage.exists(name);
  }

  roleExists(name: string): boolean {
    return this.roleStorage.exists(name);
  }

}

const permissionManager = new PermissionManagerv2(
  new RoleStorage(),
  new PermissionStorage(),
  new RolePermissionsStorage(),
  new AssignmentStorage()
);

const newPermission = permissionManager.createPermission({
  name: "createPost",
  action: "createPost",
  subject: "User",
  conditions: {
    isAuthor: true,
  },
  inverted: false,
  reason: "You are not the author of the post",
});

const newRole = permissionManager.createRole("author");
permissionManager.attachPermission(newRole, newPermission);

class User implements UserType {
  constructor(public id: number, public isAuthor: boolean) {}
}

const user = new User(1, true);
permissionManager.assign(newRole, user);

const assignment = permissionManager.getAssignment("author", user);

console.log(assignment);

const permissions = permissionManager.getPermissions();

console.log(permissions);
const ability = defineAbilityFor(user, permissions);
// test ability of user to CreatePost
console.log(ability.can("createPost", user));

function defineAbilityFor(user: UserType, permissions: PermissionType[]) {
  const { can, cannot, build } = new AbilityBuilder(Ability);
  // Add permissions to the builder
  permissions.forEach((permission) => {
    if (permission.inverted) {
      cannot(permission.name, permission.subject, permission.conditions);
    } else {
      can(permission.name, permission.subject, permission.conditions);
    }
  });
  return build();
}
