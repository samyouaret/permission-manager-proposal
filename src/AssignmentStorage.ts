interface AssignmentsStorageInterface {
  getAll(): Assignment[];
  getByUserId(userId: string): Assignment;
  get(itemName: string, userId: string): Assignment | undefined;
  add(itemName: string, userId: string): void;
  hasItem(name: string): boolean;
  remove(itemName: string, userId: string): void;
  removeByUserId(userId: string): void;
  removeByItemName(itemName: string): void;
  clear(): void;
}
