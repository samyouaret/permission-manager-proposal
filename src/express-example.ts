import express from "express";
import { Client } from "pg";
import { PermissionManagerInterface, UserType } from "./PermissionManager";
import { PermissionManagerv2 } from "./PermissionManagerv2";
import { SQLAssignmentStorage } from "./postgresStorage/SQLAssignmentStorage";
import { SQLPermissionStorage } from "./postgresStorage/SQLPermissionStorage";
import { SQLRolePermissionsStorage } from "./postgresStorage/SQLRolePermissionsStorage";
import { SQLRoleStorage } from "./postgresStorage/SQLRoleStorage";

const app = express();

// create a middleware to check if user has permission to access the route
const hasPermission = (
  permissionManager: PermissionManagerv2,
  permission: string
) => {
  return async (req: any, res: any, next: any) => {
    // check if user has permission
    // usually you would get the user id from the request
    if (await permissionManager.hasPermission("1", permission)) {
      next();
    } else {
      res.status(403).send("Forbidden");
    }
  };
};

async function main() {
  const permissionManager = await init();
  // create a route that requires a permission
  app.get(
    "/posts",
    hasPermission(permissionManager, "readPosts"),
    (req, res) => {
      res.json([
        { id: 1, title: "Post 1" },
        { id: 2, title: "Post 2" },
      ]);
    }
  );
  app.listen(3000, () => {
    console.log("Listening at http://localhost:3000");
  });
}
async function connect(client: Client) {
  await client.connect();

  const res = await client.query("SELECT $1::text as message", ["Connected!"]);
  console.log(res.rows[0].message); // Connected!
}

class User implements UserType {
  constructor(public id: number, public isAuthor: boolean) {}
}

async function init() {
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
  // clear all tables
  await assignmentStorage.clear();
  await rolePermissionStorage.clear("author");
  await rolePermissionStorage.clear("admin");
  await roleStorage.clear();
  await permissionStorage.clear();

  const permissionManager = new PermissionManagerv2(
    roleStorage,
    permissionStorage,
    rolePermissionStorage,
    assignmentStorage
  );

  const newPermission = await permissionManager.createPermission({
    name: "readPosts",
    action: "readPosts",
    subject: "User",
    conditions: {
      isAuthor: true,
    },
    inverted: false,
    reason: "You are not the author of the post",
  });

  const newRole = await permissionManager.createRole("author");
  console.log(newRole);

  await permissionManager.attachPermission(newRole, newPermission);

  const user = new User(1, true);
  await permissionManager.assign(newRole, user);

  return permissionManager;
}

main();
