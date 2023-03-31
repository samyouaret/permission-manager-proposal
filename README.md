# permission-manager-proposal

## Introduction

This is a proposal for a permission manager for nodejs. It is based on the [rbac](https://en.wikipedia.org/wiki/Role-based_access_control) model.

the main idea is to have a storage for roles, permissions and assignments. The storage can be any storage that implements the storage interface.

it could be a InMemory storage like Javascript DataStructure or any custom dataStructure, database, any, a file, a redis instance, etc.

## Usage

### Role Storage

```js
const roleStorage = new RoleStorage();

const newRole = {
  name: "admin",
  description: "Admin role",
};

roleStorage.add(newRole);

console.log(roleStorage.get("admin"));

console.log(roleStorage.getAll());

console.log(roleStorage.exists("admin"));

roleStorage.remove("admin");

console.log(roleStorage.exists("admin"));

```

### Permission Storage

```js

const permissionStorage = new PermissionStorage();

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

permissionStorage.add(newPermission);

console.log(permissionStorage.getAll());
console.log(permissionStorage.exists("createPost"));
permissionStorage.remove("createPost");
console.log(permissionStorage.exists("createPost"));
permissionStorage.clear();
console.log(permissionStorage.getAll());

```

### RolePermissions Storage

```js

const rolePermissionsStorage = new RolePermissionsStorage();

rolePermissionsStorage.add("admin", newPermission);

console.log(rolePermissionsStorage.getAll("admin"));

console.log(rolePermissionsStorage.has("admin", "createPost"));

rolePermissionsStorage.add("admin", {
  name: "UpdatePost",
  action: "UpdatePost",
  subject: "Post",
  conditions: {
    isPublished: true,
  },
  inverted: false,
  reason: "Post is not published",
});

console.log(rolePermissionsStorage.getAll("admin"));

rolePermissionsStorage.remove("admin", "createPost");

console.log(rolePermissionsStorage.getAll("admin"));
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

1. InMemoryStorage.
2. SQl Storage.
3. NoSQL Storage like MongoDB.
4. HTTP API (for usage with microservices).