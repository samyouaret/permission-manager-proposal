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
  createPermission(
    permission: PermissionType
  ): Promise<PermissionType | undefined>;
  getPermissions(): Promise<PermissionType[]>;
  getPermission(name: string): Promise<PermissionType | undefined>;
  removePermission(name: string): Promise<void>;

  createRole(name: string): Promise<Role>;
  getRoles(): Promise<Role[]>;
  getRole(name: string): Promise<Role | undefined>;
  removeRole(name: string): Promise<void>;

  attachPermission(role: Role, permission: PermissionType): Promise<void>;
  DetachPermission(role: Role, permission: PermissionType): Promise<void>;
  removePermissions(role: Role): Promise<void>;
  getAssignment(
    name: string,
    user: UserType
  ): Promise<AssignmentInterface | undefined>;

  assign(role: Role, user: UserType): Promise<void>;
  revoke(role: Role, user: UserType): Promise<void>;
  revokeAll(user: UserType): Promise<void>;

  permissionExists(name: string): Promise<boolean>;
  roleExists(name: string): Promise<boolean>;
}