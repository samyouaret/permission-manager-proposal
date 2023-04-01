import { RoleStorageInterface, Role } from "../contracts/RoleStorageInterface";

export class RoleStorage implements RoleStorageInterface {
  private roles: Map<string, Role>;

  constructor() {
    this.roles = new Map();
  }
  async clear(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async exists(name: string): Promise<boolean> {
    return this.roles.has(name);
  }

  async getAll(): Promise<Role[]> {
    return Array.from(this.roles.values());
  }

  async get(name: string): Promise<Role | undefined> {
    return this.roles.get(name);
  }

  async add(role: Role): Promise<void> {
    if (await this.exists(role.name)) {
      throw new Error(`Role with name ${role.name} already exists`);
    }
    this.roles.set(role.name, role);
  }

  async remove(name: string): Promise<void> {
    if (await this.exists(name) === false) {
      throw new Error("Role does not exist");
    }
    this.roles.delete(name);
  }
}

const roleStorage = new RoleStorage();

async function main() {
  const newRole = {
  name: "admin",
  description: "Admin role",
};

await roleStorage.add(newRole);

console.log(await roleStorage.get("admin"));

console.log(await roleStorage.getAll());

console.log(await roleStorage.exists("admin"));

await roleStorage.remove("admin");

console.log(await roleStorage.exists("admin"));

}