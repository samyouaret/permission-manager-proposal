import { RoleStorageInterface, Role } from "../contracts/RoleStorageInterface";
import { Client } from "pg";

export class SQLRoleStorage implements RoleStorageInterface {
  constructor(private client: Client) {}
  async clear(): Promise<void> {
    await this.client.query("DELETE FROM roles");
  }

  async exists(name: string): Promise<boolean> {
    const res = await this.client.query("SELECT * FROM roles WHERE name = $1", [
      name,
    ]);
    return res.rowCount > 0;
  }

  async getAll(): Promise<Role[]> {
    const res = await this.client.query("SELECT * FROM roles");
    return res.rows;
  }

  async get(name: string): Promise<Role | undefined> {
    const res = await this.client.query("SELECT * FROM roles WHERE name = $1", [
      name,
    ]);
    return res.rows[0];
  }

  async add(role: Role): Promise<void> {
    if (await this.exists(role.name)) {
      throw new Error(`Role with name ${role.name} already exists`);
    }
    await this.client.query("INSERT INTO roles(name) VALUES ($1)", [role.name]);
  }

  async remove(name: string): Promise<void> {
    if ((await this.exists(name)) === false) {
      throw new Error("Role does not exist");
    }
    await this.client.query("DELETE FROM roles WHERE name = $1", [name]);
  }
}

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

// main();
