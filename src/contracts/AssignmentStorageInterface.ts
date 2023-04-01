import { AssignmentInterface } from "./AssignmentInterface";

// convert all methods return types to accept Promise also
export interface AssignmentsStorageInterface {
  getAll(): AssignmentInterface[] | Promise<AssignmentInterface[]>;
  getByUserId(
    userId: string
  ): AssignmentInterface[] | Promise<AssignmentInterface[]>;
  get(
    roleName: string,
    userId: string
  ): AssignmentInterface | undefined | Promise<AssignmentInterface | undefined>;
  add(roleName: string, userId: string): Promise<void>;
  hasRole(name: string): Promise<boolean>;
  remove(roleName: string, userId: string): Promise<void>;
  removeByUserId(userId: string): Promise<void>;
  removeByRoleName(roleName: string): Promise<void>;
  clear(): Promise<void>;
  hasPermission(userId: string, permissionName: string): Promise<boolean>;
}
