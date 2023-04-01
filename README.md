# permission-manager-proposal

## Introduction

This is a proposal for a permission manager for nodejs. It is based on the [rbac](https://en.wikipedia.org/wiki/Role-based_access_control) model.

the main idea is to have a storage for roles, permissions and assignments. The storage can be any storage that implements the storage interface.

it could be a InMemory storage like Javascript DataStructure or any custom dataStructure, database, any, a file, a redis instance, etc.

## Usage

### Role Storage

```js
async function connect(client: Client) {
  await client.connect();

  const res = await client.query("SELECT $1::text as message", [
    "Hello world!",
  ]);
  console.log(res.rows[0].message); // Hello world!
  // await client.end();
}

async function main() {
  const roleStorage = new SQLRoleStorage(client);

  const admin = {
    name: "admin",
    description: "Admin role",
  };
  const author = {
    name: "author",
    description: "Author role",
  };
  await roleStorage.clear();
  await roleStorage.add(admin);
  await roleStorage.add(author);

  console.log(await roleStorage.get("admin"));

  console.log(await roleStorage.getAll());

  console.log(await roleStorage.exists("admin"));

  await roleStorage.remove("admin");

  console.log(await roleStorage.exists("admin"));

  await client.end();
}

main();

```

### Permission Storage

```js

 const permissionStorage = new SQLPermissionStorage(client);

  const createPost = {
    name: "createPost",
    action: "createPost",
    subject: "User",
    conditions: {
      isAuthor: true,
    },
    inverted: false,
    reason: "You are not the author of the post",
  };

  const updatePost = {
    name: "updatePost",
    action: "updatePost",
    subject: "User",
    conditions: {
      isAuthor: true,
    },
    inverted: false,
    reason: "You are not the author of the post",
  };

  await permissionStorage.add(createPost);
  await permissionStorage.add(updatePost);

  console.log(await permissionStorage.getAll());
  console.log(await permissionStorage.exists("createPost"));
  await permissionStorage.remove("createPost");
  console.log(await permissionStorage.exists("createPost"));
  // await permissionStorage.clear();
  console.log(await permissionStorage.getAll());

  await client.end();
}


```

### RolePermissions Storage

```js

async function main() {
  const rolePermissionsStorage = new SQLRolePermissionsStorage(client);
  rolePermissionsStorage.clear("author");
  const newPermission = {
    name: "createPost",
    action: "createPost",
    subject: "User",
    conditions: {
      isAuthor: true,
    },
    inverted: false,
    reason: "You are not the author of the post",
  };

  await rolePermissionsStorage.add("author", newPermission);

  console.log(await rolePermissionsStorage.getAll("author"));

  console.log(await rolePermissionsStorage.has("author", "createPost"));

  await rolePermissionsStorage.add("author", {
    name: "updatePost",
    action: "updatePost",
    subject: "Post",
    conditions: {
      isPublished: true,
    },
    inverted: false,
    reason: "Post is not published",
  });

  console.log(await rolePermissionsStorage.getAll("author"));

  await rolePermissionsStorage.remove("author", "createPost");

  console.log(await rolePermissionsStorage.getAll("author"));

  await client.end();
}

main();


```

### AssignmentStorage


```js

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
```

### Validation ❗ ❗

To validate Usability of this permission management system, we need to implement some of these storages types:

1. [x] InMemoryStorage(in Javascript).
2. [x] SQl Storage like Postgres.
   1. [ ] getting user permission should be easy.
   2. [ ] check if user has permission should be fast.
3. [ ] NoSQL Storage like MongoDB.
4. [ ] HTTP API (for usage with microservices).


## An example with InMemoryStorage

```js
import { AssignmentStorage } from "./storage/AssignmentStorage";
import { PermissionStorage } from "./storage/PermissionStorage";
import { RolePermissionsStorage } from "./storage/RolePermissionsStorage";
import { RoleStorage } from "./storage/RoleStorage";

async function main() {
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
await roleStorage.add(newRole);

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

const permission = await permissionStorage.add(newPermission);

// create new RolePermission
await rolePermissionStorage.add(newRole.name, permission);

// create new Assignment

await assignmentStorage.add(newRole.name, "user1");

// check if Assignment has Role

console.log(await assignmentStorage.hasRole("admin"));

console.log(await assignmentStorage.get("admin", "user1"));

}

main();
```

### Example with PermissionManager and SQLStorage


```js
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

```

### An example with PermissionManager and CASL library

```js
// we use PermissionManagerv2 for this example
import { AssignmentStorage } from "./storage/AssignmentStorage";
import { PermissionStorage } from "./storage/PermissionStorage";
import { RolePermissionsStorage } from "./storage/RolePermissionsStorage";
import { RoleStorage } from "./storage/RoleStorage";

async function main() {
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

const permission = await permissionStorage.add(newPermission);

// create new RolePermission
await rolePermissionStorage.add(newRole.name, permission);

// create new Assignment

await assignmentStorage.add(newRole.name, "user1");

// check if Assignment has Role

console.log(await assignmentStorage.hasRole("admin"));

console.log(await assignmentStorage.get("admin", "user1"));

}
```