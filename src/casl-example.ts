import { Ability, AbilityBuilder } from "@casl/ability";
import {
  PermissionType,
  UserType,
} from "./contracts/PermissionManagerInterface";
import { PermissionStorage } from "./storage/PermissionStorage";

function defineAbilityFor(user: UserType, permissions: PermissionType[]) {
  const { can, cannot, build } = new AbilityBuilder(Ability);
  // fetch permissions from the database
  // Add permissions to the builder
  permissions.forEach((permission) => {
    if (permission.inverted) {
      cannot(permission.action, permission.subject, permission.conditions);
    } else {
      can(permission.action, permission.subject, permission.conditions);
    }
  });
  return build();
}

class User {
  id: number;
  isAuthor: boolean;
  name: string;
  constructor(id: number, name: string, isAuthor: boolean) {
    this.id = id;
    this.isAuthor = isAuthor;
    this.name = name;
  }
}

async function main() {
  // create new PermissionStorage
  const permissionStorage = new PermissionStorage();
  // create new Permission
  const newPermission = {
    name: "createUser",
    action: "createUser",
    subject: "User",
    conditions: {
      isAuthor: true,
    },
    inverted: false,
    reason: "Post is not published",
  };

  await permissionStorage.add(newPermission);
  // get all permissions
  const permissions = await permissionStorage.getAll();
  const user = new User(122, "John", true);
  let build = await defineAbilityFor(user, permissions);
  // Subject must be the same as the class
  console.log(build.can("createUser", user)); // true
  console.log(build.can("deleteUser", user)); // false
}

main();
