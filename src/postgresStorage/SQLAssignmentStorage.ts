import { Client } from "pg";
import { AssignmentInterface } from "../contracts/AssignmentInterface";
import { AssignmentsStorageInterface } from "../contracts/AssignmentStorageInterface";

export class SQLAssignmentStorage implements AssignmentsStorageInterface {
  constructor(private client: Client) {}

  async hasPermission(
    userId: string,
    permissionName: string
  ): Promise<boolean> {
    // join
    const res = await this.client.query(
      `SELECT COUNT(*) > 0 AS has_permission
FROM assignments
JOIN role_permissions rp  ON rp.role_name = assignments.role_name
WHERE assignments.user_id = $1
  AND rp.permission_name =$2;
`,
      [userId, permissionName]
    );
    return res.rows[0].has_permission;
  }

  async getAll(): Promise<AssignmentInterface[]> {
    const res = await this.client.query("SELECT * FROM assignments");
    return res.rows;
  }

  async getByUserId(userId: string): Promise<AssignmentInterface[]> {
    const res = await this.client.query(
      "SELECT * FROM assignments WHERE user_id = $1",
      [userId]
    );
    return res.rows;
  }

  async get(
    roleName: string,
    userId: string
  ): Promise<AssignmentInterface | undefined> {
    // get assignments for role
    const res = await this.client.query(
      "SELECT * FROM assignments WHERE role_name = $1 AND user_id = $2",
      [roleName, userId]
    );
    return res.rows[0];
  }

  async add(roleName: string, userId: string): Promise<void> {
    // check if assignment already exists
    if (await this.get(roleName, userId)) {
      throw new Error(`Assignment already exists`);
    }
    await this.client.query(
      "INSERT INTO assignments(role_name, user_id) VALUES ($1, $2)",
      [roleName, userId]
    );
  }

  async hasRole(name: string): Promise<boolean> {
    const res = await this.client.query(
      "SELECT * FROM assignments WHERE role_name = $1",
      [name]
    );
    return res.rowCount > 0;
  }

  async remove(roleName: string, userId: string): Promise<void> {
    await this.client.query(
      "DELETE FROM assignments WHERE role_name = $1 AND user_id = $2",
      [roleName, userId]
    );
  }

  async removeByUserId(userId: string): Promise<void> {
    await this.client.query("DELETE FROM assignments WHERE user_id = $1", [
      userId,
    ]);
  }

  async removeByRoleName(roleName: string): Promise<void> {
    await this.client.query("DELETE FROM assignments WHERE role_name = $1", [
      roleName,
    ]);
  }

  async clear(): Promise<void> {
    await this.client.query("DELETE FROM assignments");
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
  const assignmentStorage = new SQLAssignmentStorage(client);
  assignmentStorage.clear();
  // await assignmentStorage.add("admin", "1");
  await assignmentStorage.add("author", "1");
  // get all assignments for user

  let assignments = await assignmentStorage.getByUserId("1");

  console.log(assignments);

  let adminAssignment = await assignmentStorage.get("admin", "1");
  let authorAssignment = await assignmentStorage.get("Author", "1");

  console.log("has author role", await assignmentStorage.hasRole("author"));

  console.log(adminAssignment);
  console.log(authorAssignment);
  // remove assignment

  await assignmentStorage.remove("admin", "1");
  await assignmentStorage.remove("author", "1");

  // check if user has role

  let hasAdminRole = await assignmentStorage.hasRole("admin");
  let hasAuthorRole = await assignmentStorage.hasRole("author");

  console.log(hasAdminRole);
  console.log(hasAuthorRole);
  client.end();
}

// main();
