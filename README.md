# permission-manager-proposal


## Usage

### Role Storage

```
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
