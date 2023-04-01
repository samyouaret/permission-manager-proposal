import { Client } from "pg";
import { RolePermissionsStorageInterface } from "../contracts/RolePermissionsStorageInterface";
import { PermissionType } from "../PermissionManager";

export class SQLRolePermissionsStorage
  implements RolePermissionsStorageInterface
{
  constructor(private client: Client) {}

  async clear(roleName: string): Promise<void> {
    await this.client.query(
      "DELETE FROM role_permissions WHERE role_name = $1",
      [roleName]
    );
  }

  async getAll(roleName: string): Promise<PermissionType[]> {
    const res = await this.client.query(
      "SELECT * FROM role_permissions WHERE role_name = $1",
      [roleName]
    );
    return res.rows;
  }

  async has(roleName: string, PermissionName: string): Promise<boolean> {
    const res = await this.client.query(
      "SELECT * FROM role_permissions WHERE role_name = $1 AND permission_name = $2",
      [roleName, PermissionName]
    );
    return res.rowCount > 0;
  }

  async add(roleName: string, permission: PermissionType): Promise<void> {
    if (await this.has(roleName, permission.name)) {
      throw new Error(
        `Role ${roleName} already has permission ${permission.name}`
      );
    }
    await this.client.query(
      "INSERT INTO role_permissions(role_name, permission_name) VALUES ($1, $2)",
      [roleName, permission.name]
    );
  }

  async hasPermission(PermissionName: string): Promise<boolean> {
    const res = await this.client.query(
      "SELECT * FROM role_permissions WHERE permission_name = $1",
      [PermissionName]
    );
    return res.rowCount > 0;
  }

  async remove(roleName: string, permissionName: string): Promise<void> {
    await this.client.query(
      "DELETE FROM role_permissions WHERE role_name = $1 AND permission_name = $2",
      [roleName, permissionName]
    );
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
