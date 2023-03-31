import { Assignment } from "../Assignment";
import { AssignmentInterface } from "../contracts/AssignmentInterface";
import { AssignmentsStorageInterface } from "../contracts/AssignmentStorageInterface";

export class AssignmentStorage implements AssignmentsStorageInterface {
  private assignments: Map<string, Map<string, AssignmentInterface>>;

  constructor() {
    this.assignments = new Map();
  }

  getAll(): AssignmentInterface[] {
    throw new Error("Method not implemented.");
  }

  getByUserId(userId: string): AssignmentInterface[] {
    return Array.from(this.assignments.get(userId)?.values() ?? []);
  }

  get(roleName: string, userId: string): AssignmentInterface | undefined {
    // get assignments for role
    return this.assignments.get(roleName)?.get(userId);
  }

  add(roleName: string, userId: string): void {
    let userRoles = this.assignments.get(userId);
    let roleUsers = this.assignments.get(roleName);
    if (roleUsers === undefined) {
      roleUsers = new Map<string, AssignmentInterface>();
      this.assignments.set(roleName, roleUsers);
    }
    if (userRoles === undefined) {
      userRoles = new Map<string, AssignmentInterface>();
      this.assignments.set(userId, userRoles);
    }
    // create new Assignment
    const assignment = new Assignment(roleName, userId, Date.now());
    // add assignment to userRoles
    userRoles.set(roleName, assignment);
    // add assignment to roleUsers
    roleUsers.set(userId, assignment);
  }

  hasRole(name: string): boolean {
    return this.assignments.has(name);
  }

  remove(roleName: string, userId: string): void {
    let userRoles = this.assignments.get(userId);
    let roleUsers = this.assignments.get(roleName);
    // remove assignment from roleUsers
    roleUsers?.delete(userId);
    // remove assignment from userRoles
    userRoles?.delete(roleName);
  }

  removeByUserId(userId: string): void {
    // get all roles for user
    const userRoles = this.assignments.get(userId);
    // get all roleNames for user
    const roleNames = Array.from(userRoles?.keys() ?? []);
    // iterate over roleNames and remove all user assignments
    roleNames.forEach((roleName) => {
      let roleUsers = this.assignments.get(roleName);
      // remove assignment from roleUsers
      roleUsers?.delete(userId);
    });
    this.assignments.delete(userId);
  }

  removeByRoleName(roleName: string): void {
    // get all roles for user
    const roleUsers = this.assignments.get(roleName);
    // get all roleNames for user
    const userIds = Array.from(roleUsers?.keys() ?? []);
    // iterate over userIds and remove all role assignments
    userIds.forEach((userId) => {
      let userRoles = this.assignments.get(userId);
      // remove assignment from roleUsers
      userRoles?.delete(roleName);
    });

    this.assignments.delete(roleName);
  }

  clear(): void {
    this.assignments.clear();
  }
}

const assignmentStorage = new AssignmentStorage();

// add new Assignment

assignmentStorage.add("admin", "1");
assignmentStorage.add("Author", "1");
// get all assignments for user

let assignments = assignmentStorage.getByUserId("1");

console.log(assignments);

let adminAssignment = assignmentStorage.get("admin", "1");
let authorAssignment = assignmentStorage.get("Author", "1");

console.log(adminAssignment);
console.log(authorAssignment);
