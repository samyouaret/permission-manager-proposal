/**
 * `AssignmentInterface` represents an assignment of a role to a user.
 */
export interface AssignmentInterface {
  getUserId(): string;

  getRoleName(): string;

  withRoleName(roleName: string): AssignmentInterface;

  getCreatedAt(): number;
}
