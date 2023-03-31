import { Client } from "pg";
import { Ability, AbilityBuilder } from "@casl/ability";

const client = new Client({
  host: "localhost",
  database: "casl_db",
  user: "postgres_user",
  password: "postgres_pass",
});

async function connect() {
  await client.connect();

  const res = await client.query("SELECT $1::text as message", [
    "Hello world!",
  ]);
  console.log(res.rows[0].message); // Hello world!
  // await client.end();
}

// the cache should be at this level
async function getRules(user: User) {
  const res = await client.query("SELECT * FROM rules where user_id = $1", [
    user.id,
  ]);
  return res.rows;
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

class Admin {
  isAuthor: boolean;
  name: string;
  constructor(name: string, isAuthor: boolean) {
    this.isAuthor = isAuthor;
    this.name = name;
  }
}

async function defineAbilityFor(user: User) {
  const { can, cannot, build } = new AbilityBuilder(Ability);
  // fetch permissions from the database
  const permissions = await getRules(user);
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

async function main() {
  await connect();
  const user = new User(122, "John", true);
  let build = await defineAbilityFor(user);
  // Subject must have same name as the class
  console.log(build.can("createUser", user));
  console.log(build.can("deleteUser", user));
  const user2 = new User(144, "Adam", true);
  // manage is a special action in casl
  console.log(build.can("manage", user2));
  await client.end();
}

main();
