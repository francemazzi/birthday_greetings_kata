import { UserFactory } from "../domain/repositories/user_factory";
import { BirthdayService } from "../domain/repositories/birthday_service";
import { EmailService } from "../application/services/email_service_model";

describe("Birthday E2E Test", () => {
  const userFactory = new UserFactory();
  const birthdayService = new BirthdayService();

  it("dovrebbe identificare i compleanni esistenti e inviare email", async () => {
    const existingUsers = await userFactory.getUsers();

    if (existingUsers.length === 0) {
      const generateRandomName = (): string => {
        const characters = "abcdefghijklmnopqrstuvwxyz";
        const length = Math.floor(Math.random() * 5) + 4;
        const randomString = Array.from({ length }, () =>
          characters.charAt(Math.floor(Math.random() * characters.length))
        ).join("");
        return randomString.charAt(0).toUpperCase() + randomString.slice(1);
      };

      const getRandomDate = () => {
        const start = new Date();
        start.setFullYear(start.getFullYear() - 50);
        const end = new Date();
        return new Date(
          start.getTime() + Math.random() * (end.getTime() - start.getTime())
        );
      };

      for (let i = 0; i < 4; i++) {
        const name = generateRandomName();
        const surname = generateRandomName();
        const email = `${name.toLowerCase()}.${surname.toLowerCase()}@test.it`;

        await userFactory.createUser({
          email,
          name,
          surname,
          birthday: getRandomDate(),
        });
      }

      const birthdayToday = new Date();
      birthdayToday.setFullYear(1990);

      const name = generateRandomName();
      const surname = generateRandomName();
      const email = `${name.toLowerCase()}.${surname.toLowerCase()}@test.it`;

      await userFactory.createUser({
        email,
        name,
        surname,
        birthday: birthdayToday,
      });
    }

    const { birthdayUsers } = await userFactory.findBirthdayUsers();

    jest
      .spyOn(EmailService.prototype, "verifyConnection")
      .mockResolvedValue(true);
    jest.spyOn(EmailService.prototype, "sendEmail").mockResolvedValue(true);

    const result = await birthdayService.sendBirthdayWishes();

    expect(result.success).toBe(true);
    expect(result.birthdayWishesSent).toBe(birthdayUsers.length);
    expect(EmailService.prototype.sendEmail).toHaveBeenCalledTimes(
      birthdayUsers.length
    );

    birthdayUsers.forEach((user) => {
      expect(EmailService.prototype.sendEmail).toHaveBeenCalledWith({
        to: user.email,
        subject: expect.any(String),
        content: expect.any(String),
      });
    });
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });
});
