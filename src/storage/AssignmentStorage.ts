import { Assignment } from "../Assignment";
import { AssignmentInterface } from "../contracts/AssignmentInterface";
import { AssignmentsStorageInterface } from "../contracts/AssignmentStorageInterface";

export class AssignmentStorage implements AssignmentsStorageInterface {
  private assignments: Map<string, Map<string, AssignmentInterface>>;

  constructor() {
    this.assignments = new Map();
  }

  async hasPermission(
    userId: string,
    permissionName: string
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async getAll(): Promise<AssignmentInterface[]> {
    throw new Error("Method not implemented.");
  }

  async getByUserId(userId: string): Promise<AssignmentInterface[]> {
    return Array.from(this.assignments.get(userId)?.values() ?? []);
  }

  async get(
    roleName: string,
    userId: string
  ): Promise<AssignmentInterface | undefined> {
    // get assignments for role
    return this.assignments.get(roleName)?.get(userId);
  }

  async add(roleName: string, userId: string): Promise<void> {
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

  async hasRole(name: string): Promise<boolean> {
    return this.assignments.has(name);
  }

  async remove(roleName: string, userId: string): Promise<void> {
    let userRoles = this.assignments.get(userId);
    let roleUsers = this.assignments.get(roleName);
    // remove assignment from roleUsers
    roleUsers?.delete(userId);
    // remove assignment from userRoles
    userRoles?.delete(roleName);
  }

  async removeByUserId(userId: string): Promise<void> {
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

  async removeByRoleName(roleName: string): Promise<void> {
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

  async clear(): Promise<void> {
    this.assignments.clear();
  }
}

async function main() {
  const assignmentStorage = new AssignmentStorage();

  // add new Assignment

  await assignmentStorage.add("admin", "1");
  await assignmentStorage.add("Author", "1");
  // get all assignments for user

  let assignments = await assignmentStorage.getByUserId("1");

  console.log(assignments);

  let adminAssignment = await assignmentStorage.get("admin", "1");
  let authorAssignment = await assignmentStorage.get("Author", "1");

  console.log(adminAssignment);
  console.log(authorAssignment);
}
