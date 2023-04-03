import { Ability, AbilityBuilder } from "@casl/ability";
import { Client } from "pg";
import { PermissionType, UserType } from "./PermissionManager";
import { PermissionManagerv2 } from "./PermissionManagerv2";
import { SQLAssignmentStorage } from "./postgresStorage/SQLAssignmentStorage";
import { SQLPermissionStorage } from "./postgresStorage/SQLPermissionStorage";
import { SQLRolePermissionsStorage } from "./postgresStorage/SQLRolePermissionsStorage";
import { SQLRoleStorage } from "./postgresStorage/SQLRoleStorage";

async function connect(client: Client) {
  await client.connect();

  const res = await client.query("SELECT $1::text as message", [
    "Connected!",
  ]);
  console.log(res.rows[0].message); // Connected!
}

class User implements UserType {
  constructor(public id: number, public isAuthor: boolean) {}
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
    name: "createPost",
    action: "createPost",
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

  const assignment = await permissionManager.getAssignment("author", user);

  console.log(assignment); // { user_id: '1', role_name: 'author' }

  const permissions = await permissionManager.getPermissions();

  console.log(permissions); // [ { name: 'createPost', action: 'createPost', subject: 'User', conditions: { isAuthor: true }, inverted: false, reason: 'You are not the author of the post' } ]
  const ability = defineAbilityFor(user, permissions);
  // test ability of user to CreatePost
  console.log(ability.can("createPost", user)); // true

  // check if user has permission to createPost
  console.log(await permissionManager.hasPermission("1", "createPost")); // true
  await client.end();
}

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

main();
