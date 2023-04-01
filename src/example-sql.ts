import { Client } from "pg";
import { SQLAssignmentStorage } from "./postgresStorage/SQLAssignmentStorage";
import { SQLPermissionStorage } from "./postgresStorage/SQLPermissionStorage";
import { SQLRolePermissionsStorage } from "./postgresStorage/SQLRolePermissionsStorage";
import { SQLRoleStorage } from "./postgresStorage/SQLRoleStorage";

async function connect(client: Client) {
  await client.connect();

  const res = await client.query("SELECT $1::text as message", [
    "Hello world!",
  ]);
  console.log(res.rows[0].message); // Hello world!
  // await client.end();
}

async function main() {
  const client = new Client({
    host: "localhost",
    database: "casl_db",
    user: "postgres_user",
    password: "postgres_pass",
  });
  await connect(client);
  // create new RoleStorage
  const roleStorage = new SQLRoleStorage(client);
  // create new PermissionStorage
  const permissionStorage = new SQLPermissionStorage(client);
  // create new RolePermissionStorage
  const rolePermissionStorage = new SQLRolePermissionsStorage(client);
  // create new AssignmentStorage
  const assignmentStorage = new SQLAssignmentStorage(client);

  // clear all storages
  await rolePermissionStorage.clear("admin");
  await rolePermissionStorage.clear("author");
  await assignmentStorage.clear();
  await roleStorage.clear();
  await permissionStorage.clear();
  // create new Role
  const newRole = { name: "admin", description: "Administrator" };
  await roleStorage.add(newRole);

  // create new Permission
  const newPermission = {
    name: "updatePost",
    action: "updatePost",
    subject: "Post",
    conditions: {
      isPublished: true,
    },
    inverted: false,
    reason: "Post is not published",
  };

  const permission = await permissionStorage.add(newPermission);

  // create new RolePermission
  await rolePermissionStorage.add(newRole.name, permission);

  // create new Assignment

  await assignmentStorage.add(newRole.name, "user1");

  // check if Assignment has Role

  console.log(await assignmentStorage.hasRole("admin"));

  console.log(await assignmentStorage.get("admin", "user1"));

  
  await client.end();
}

main();
