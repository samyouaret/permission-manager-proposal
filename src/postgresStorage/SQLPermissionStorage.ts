import { Client } from "pg";
import { PermissionStorageInterface } from "../contracts/PermissionStorageInterface";
import { PermissionType } from "../PermissionManager";

export class SQLPermissionStorage implements PermissionStorageInterface {
  constructor(private client: Client) {}
  async getAll(): Promise<PermissionType[]> {
    const res = await this.client.query("SELECT * FROM permissions");
    return res.rows;
  }

  async get(name: string): Promise<PermissionType | undefined> {
    const res = await this.client.query(
      "SELECT * FROM permissions WHERE name = $1",
      [name]
    );
    return res.rows[0];
  }

  async exists(name: string): Promise<boolean> {
    const res = await this.client.query(
      "SELECT * FROM permissions WHERE name = $1",
      [name]
    );
    return res.rowCount > 0;
  }

  async add(permission: PermissionType): Promise<PermissionType> {
    if (await this.exists(permission.name)) {
      throw new Error(`Permission with name ${permission.name} already exists`);
    }
    await this.client.query(
      "INSERT INTO permissions(name, action, subject, conditions, inverted, reason) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        permission.name,
        permission.action,
        permission.subject,
        permission.conditions,
        permission.inverted,
        permission.reason,
      ]
    );
    return permission;
  }

  async update(name: string, permission: PermissionType): Promise<void> {
    if ((await this.exists(name)) === false) {
      throw new Error("Permission does not exist");
    }
    await this.client.query(
      "UPDATE permissions SET name = $1, action = $2, subject = $3, conditions = $4, inverted = $5, reason = $6 WHERE name = $7",
      [
        permission.name,
        permission.action,
        permission.subject,
        permission.conditions,
        permission.inverted,
        permission.reason,
        name,
      ]
    );
  }

  async remove(name: string): Promise<void> {
    if ((await this.exists(name)) === false) {
      throw new Error("Permission does not exist");
    }
    await this.client.query("DELETE FROM permissions WHERE name = $1", [name]);
  }

  async clear(): Promise<void> {
    await this.client.query("DELETE FROM permissions");
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

// main();
