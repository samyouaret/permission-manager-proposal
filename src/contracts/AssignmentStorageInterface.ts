import { AssignmentInterface } from "./AssignmentInterface";

export interface AssignmentsStorageInterface {
  getAll(): AssignmentInterface[];
  getByUserId(userId: string): AssignmentInterface[];
  get(roleName: string, userId: string): AssignmentInterface | undefined;
  add(roleName: string, userId: string): void;
  hasRole(name: string): boolean;
  remove(roleName: string, userId: string): void;
  removeByUserId(userId: string): void;
  removeByRoleName(roleName: string): void;
  clear(): void;
}
