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

export class PermissionManagerv2 implements PermissionManagerInterface {
  constructor(
    private roleStorage: RoleStorageInterface,
    private permissionStorage: PermissionStorageInterface,
    private rolePermissionStorage: RolePermissionsStorageInterface,
    private assignStorage: AssignmentsStorageInterface
  ) {}

  async createPermission(permission: PermissionType): Promise<PermissionType> {
    await this.permissionStorage.add(permission);

    return permission;
  }

  async getPermission(name: string): Promise<PermissionType | undefined> {
    return this.permissionStorage.get(name);
  }

  async getRoles(): Promise<Role[]> {
    return this.roleStorage.getAll();
  }

  async getRole(name: string): Promise<Role | undefined> {
    return this.roleStorage.get(name);
  }

  async getPermissions(): Promise<PermissionType[]> {
    return this.permissionStorage.getAll();
  }

  async removePermission(name: string): Promise<void> {
    // remove only if is not used by any role
    if (await this.rolePermissionStorage.hasPermission(name)) {
      throw new Error("Permission is used by a role");
    }

    this.permissionStorage.remove(name);
  }

  async createRole(name: string): Promise<Role> {
    if (await this.roleExists(name)) {
      throw new Error("Role already exists");
    }

    const role = { name };
    this.roleStorage.add(role);

    return role;
  }

  async removeRole(name: string): Promise<void> {
    if ((await this.roleExists(name)) === false) {
      throw new Error("Role does not exist");
    }
    // remove only if is not used by any user
    if (await this.assignStorage.hasRole(name)) {
      throw new Error("Role is used by a user");
    }

    this.roleStorage.remove(name);
  }

  async attachPermission(
    role: Role,
    permission: PermissionType
  ): Promise<void> {
    if ((await this.permissionExists(permission.name)) === false) {
      throw new Error("Permission does not exist");
    }
    // check if rolePermissionStorage already has the permission
    if (await this.rolePermissionStorage.has(role.name, permission.name)) {
      throw new Error("Permission is already attached to the role");
    }

    this.rolePermissionStorage.add(role.name, permission);
  }

  async DetachPermission(
    role: Role,
    permission: PermissionType
  ): Promise<void> {
    if ((await this.permissionExists(permission.name)) === false) {
      throw new Error("Permission does not exist");
    }
    // check if rolePermissionStorage already has the permission
    if (
      (await this.rolePermissionStorage.has(role.name, permission.name)) ===
      false
    ) {
      throw new Error("Permission is not attached to the role");
    }

    this.rolePermissionStorage.remove(role.name, permission.name);
  }

  async removePermissions(role: Role): Promise<void> {
    this.rolePermissionStorage.clear(role.name);
  }

  async assign(role: Role, user: UserType): Promise<void> {
    if ((await this.roleExists(role.name)) === false) {
      throw new Error("Role does not exist");
    }

    return this.assignStorage.add(role.name, user.id);
  }

  async revoke(role: Role, user: UserType): Promise<void> {
    if ((await this.roleExists(role.name)) === false) {
      throw new Error("Role does not exist");
    }

    this.assignStorage.remove(role.name, user.id);
  }

  async revokeAll(user: UserType): Promise<void> {
    this.assignStorage.removeByUserId(user.id);
  }

  async getAssignment(
    name: string,
    user: UserType
  ): Promise<AssignmentInterface | undefined> {
    return await this.assignStorage.get(name, user.id);
  }

  async permissionExists(name: string): Promise<boolean> {
    return this.permissionStorage.exists(name);
  }

  async roleExists(name: string): Promise<boolean> {
    return this.roleStorage.exists(name);
  }

  async hasPermission(userId: string, permissionName: string) {

    return this.assignStorage.hasPermission(userId, permissionName);
    // const assignments = await this.assignStorage.getByUserId(userId);
    // const roles = assignments.map((assignment) => assignment.getRoleName());

    // for (const role of roles) {
    //   if (await this.rolePermissionStorage.has(role, permissionName)) {
    //     return true;
    //   }
    // }

    // return false;
  }
}

async function main() {
  const permissionManager = new PermissionManagerv2(
    new RoleStorage(),
    new PermissionStorage(),
    new RolePermissionsStorage(),
    new AssignmentStorage()
  );

  const newPermission = await permissionManager.createPermission({
    name: "createPost",
    action: "createPost",
    subject: "User",
    conditions: {
      isAuthor: true,
    },
    inverted: false,
    reason: "You are not the author of the post",
  });

  const newRole = await permissionManager.createRole("author");
  await permissionManager.attachPermission(newRole, newPermission);

  class User implements UserType {
    constructor(public id: number, public isAuthor: boolean) {}
  }

  const user = new User(1, true);
  await permissionManager.assign(newRole, user);

  const assignment = await permissionManager.getAssignment("author", user);

  console.log(assignment);

  const permissions = await permissionManager.getPermissions();

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

  console.log(await permissionManager.hasPermission("1", "createPost"));
}
