import { AssignmentInterface } from "./AssignmentInterface";

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
}

export interface UserType {
  id: any;
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
  getAssignment(name: string, user: UserType): AssignmentInterface | undefined;

  assign(role: Role, user: UserType): void;
  revoke(role: Role, user: UserType): void;
  revokeAll(user: UserType): void;

  permissionExists(name: string): boolean;
  roleExists(name: string): boolean;
}
