interface AssignmentsStorageInterface {
  getAll(): Assignment[];
  getByUserId(userId: string | number): Assignment;
  get(itemName: string, userId: string | number): Assignment | undefined;
  add(itemName: string, userId: string | number): void;
  hasItem(name: string): boolean;
  remove(itemName: string, userId: string | number): void;
  removeByUserId(userId: string | number): void;
  removeByItemName(itemName: string): void;
  clear(): void;
}
