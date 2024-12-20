export class UserEntity {
  constructor(
    public readonly lastName: string,
    public readonly firstName: string,
    public readonly dateOfBirth: Date,
    public readonly email: string
  ) {}

  isBirthday(today: Date): boolean {
    return (
      this.dateOfBirth.getDate() === today.getDate() &&
      this.dateOfBirth.getMonth() === today.getMonth()
    );
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
