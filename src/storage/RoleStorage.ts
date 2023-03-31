import { RoleStorageInterface, Role } from "../contracts/RoleStorageInterface";

export class RoleStorage implements RoleStorageInterface {
  private roles: Map<string, Role>;

  constructor() {
    this.roles = new Map();
  }
  clear(): void {
    throw new Error("Method not implemented.");
  }
  exists(name: string): boolean {
    return this.roles.has(name);
  }

  getAll(): Role[] {
    return Array.from(this.roles.values());
  }

  get(name: string): Role | undefined {
    return this.roles.get(name);
  }

  add(role: Role): void {
    if (this.exists(role.name)) {
      throw new Error(`Role with name ${role.name} already exists`);
    }
    this.roles.set(role.name, role);
  }

  remove(name: string): void {
    if (this.exists(name) === false) {
      throw new Error("Role does not exist");
    }
    this.roles.delete(name);
  }
}

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
