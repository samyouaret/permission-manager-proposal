import { Ability, AbilityBuilder } from "@casl/ability";

export interface PermissionType {
  name: string;
  action: string;
  subject: string;
  /** an array of fields to which user has (or not) access */
  fields?: string[];
  /** an object of conditions which restricts the rule scope */
  conditions?: any;
  /** indicates whether rule allows or forbids something */
  inverted?: boolean;
  /** message which explains why rule is forbidden */
  reason?: string;
}

export interface Role {
  name: string;
  permissions: PermissionType[];
}

export interface UserType {
  id: any;
}

export class Permission implements PermissionType {
  name: string;
  action: string;
  subject: string;
  fields?: string[];
  conditions?: any;
  inverted?: boolean;
  reason?: string;

  constructor(
    name: string,
    action: string,
    subject: string,
    fields?: string[],
    conditions?: any,
    inverted?: boolean,
    reason?: string
  ) {
    this.name = name;
    this.action = action;
    this.subject = subject;
    this.fields = fields;
    this.conditions = conditions;
    this.inverted = inverted;
    this.reason = reason;
  }

  asObject(): PermissionType {
    return {
      name: this.name,
      action: this.action,
      subject: this.subject,
      fields: this.fields,
      conditions: this.conditions,
      inverted: this.inverted,
      reason: this.reason,
    };
  }
}

export interface PermissionManagerInterface {
  createPermission(permission: PermissionType): PermissionType | undefined;
  getPermissions(): PermissionType[];
  getPermission(name: string): PermissionType | undefined;
  removePermission(name: string): void;

  createRole(name: string): Role;
  getRoles(): Role[];
  getRole(name: string): Role | undefined;
  removeRole(name: string): void;

  attachPermission(role: Role, permission: PermissionType): void;
  DetachPermission(role: Role, permission: PermissionType): void;
  removePermissions(role: Role): void;
  getAssignment(name: string, user: UserType): Role | undefined;

  assign(role: Role, user: UserType): void;
  revoke(role: Role, user: UserType): void;
  revokeAll(user: UserType): void;

  permissionExists(name: string): boolean;
  roleExists(name: string): boolean;
}

class PermissionManager implements PermissionManagerInterface {
  private permissions: Map<string, PermissionType>;
  private roles: Map<string, Role>;
  private assignments: Map<string, Set<Role>>;

  constructor() {
    this.permissions = new Map();
    this.roles = new Map();
    this.assignments = new Map();
  }

  createPermission(permission: PermissionType): PermissionType {
    this.permissions.set(permission.name, permission);
    return permission;
  }

  getPermission(name: string): PermissionType | undefined {
    return this.permissions.get(name);
  }

  getRoles(): Role[] {
    return Array.from(this.roles.values());
  }

  getRole(name: string): Role | undefined {
    return this.roles.get(name);
  }

  getPermissions(): PermissionType[] {
    return Array.from(this.permissions.values());
  }

  removePermission(name: string): void {
    this.permissions.delete(name);
    for (const role of this.roles.values()) {
      const index = role.permissions.findIndex((p) => p.name === name);
      if (index >= 0) {
        role.permissions.splice(index, 1);
      }
    }
  }

  createRole(name: string): Role {
    const role = { name, permissions: [] };
    this.roles.set(name, role);
    return role;
  }

  removeRole(name: string): void {
    if (!this.roleExists(name)) {
      throw new Error("Role does not exist");
    }
    this.roles.delete(name);
    for (const [userName, roles] of this.assignments) {
    }
  }

  attachPermission(role: Role, permission: PermissionType): void {
    role.permissions.push(permission);
  }

  DetachPermission(role: Role, permission: PermissionType): void {
    const index = role.permissions.findIndex((p) => p.name === permission.name);
    if (index >= 0) {
      role.permissions.splice(index, 1);
    }
  }

  removePermissions(role: Role): void {
    role.permissions = [];
  }

  assign(role: Role, user: UserType): void {
    let roles = this.assignments.get(user.id);
    if (!roles) {
      roles = new Set<Role>();
      this.assignments.set(user.id, roles);
    }
    roles.add(role);
  }

  revoke(role: Role, user: UserType): void {
    const roles = this.assignments.get(user.id);
    if (roles) {
      roles.delete(role);
    }
  }

  revokeAll(user: UserType): void {
    this.assignments.delete(user.id);
  }

  getAssignment(name: string, user: UserType): Role | undefined {
    const roles = this.assignments.get(user.id);
    if (roles) {
      for (const role of roles) {
        if (role.name === name) {
          return role;
        }
      }
    }
  }

  permissionExists(name: string): boolean {
    return this.permissions.has(name);
  }

  roleExists(name: string): boolean {
    return this.roles.has(name);
  }

  getUserPermissions(user: UserType): PermissionType[] {
    const roles = this.assignments.get(user.id);
    if (roles) {
      const permissions: PermissionType[] = [];
      for (const role of roles) {
        permissions.push(...role.permissions);
      }
      return permissions;
    }
    return [];
  }
}

const permissionManager = new PermissionManager();

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

const permissions = permissionManager.getUserPermissions(user);

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