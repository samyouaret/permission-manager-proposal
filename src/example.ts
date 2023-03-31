import { AssignmentStorage } from "./storage/AssignmentStorage";
import { PermissionStorage } from "./storage/PermissionStorage";
import { RolePermissionsStorage } from "./storage/RolePermissionsStorage";
import { RoleStorage } from "./storage/RoleStorage";

// create new RoleStorage
const roleStorage = new RoleStorage();
// create new PermissionStorage
const permissionStorage = new PermissionStorage();
// create new RolePermissionStorage
const rolePermissionStorage = new RolePermissionsStorage();
// create new AssignmentStorage
const assignmentStorage = new AssignmentStorage();

// create new Role
const newRole = { name: "admin", description: "Administrator" };
const role = roleStorage.add(newRole);

// create new Permission
const newPermission = {
  name: "UpdatePost",
  action: "UpdatePost",
  subject: "Post",
  conditions: {
    isPublished: true,
  },
  inverted: false,
  reason: "Post is not published",
};

const permission = permissionStorage.add(newPermission);

// create new RolePermission
rolePermissionStorage.add(newRole.name, permission);

// create new Assignment

assignmentStorage.add(newRole.name, "user1");

// check if Assignment has Role

console.log(assignmentStorage.hasRole("admin"));

console.log(assignmentStorage.get("admin", "user1"));
