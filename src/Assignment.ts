/**
 * `Assignment` represents an assignment of a role or a permission to a user.
 */
class Assignment {
  /**
   * The user ID. This should be a string representing the unique identifier of a user.
   */
  private userId: string;

  /**
   * The role or permission name.
   */
  private itemName: string;

  /**
   * UNIX timestamp representing the assignment creation time.
   */
  private createdAt: number;

  /**
   * @param userId The user ID. This should be a string representing the unique identifier of a user.
   * @param itemName The role or permission name.
   * @param createdAt UNIX timestamp representing the assignment creation time.
   */
  constructor(userId: string, itemName: string, createdAt: number) {
    this.userId = userId;
    this.itemName = itemName;
    this.createdAt = createdAt;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getItemName(): string {
    return this.itemName;
  }

  public withItemName(roleName: string): Assignment {
    const newAssignment = new Assignment(this.userId, roleName, this.createdAt);
    return newAssignment;
  }

  public getCreatedAt(): number {
    return this.createdAt;
  }
}