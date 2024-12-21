import { UserFactory } from "../domain/repositories/user_factory";
import prisma from "../infrastructure/utils/prisma_client";

describe("UserFactory - Birthday Tests", () => {
  const userFactory = new UserFactory();
  const testUserIds: string[] = [];

  const nomi = [
    "Marco",
    "Giuseppe",
    "Anna",
    "Sofia",
    "Laura",
    "Paolo",
    "Maria",
  ];
  const cognomi = ["Rossi", "Bianchi", "Ferrari", "Romano", "Costa", "Ricci"];

  beforeEach(async () => {
    testUserIds.length = 0;
  });

  afterEach(async () => {
    await prisma.user.deleteMany({
      where: {
        id: {
          in: testUserIds,
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("should create 5 users with random birthdays and one today", async () => {
    const today = new Date();
    const users = [];

    const getRandomDate = () => {
      const start = new Date();
      start.setFullYear(start.getFullYear() - 50);
      const end = new Date();
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
    };

    for (let i = 0; i < 4; i++) {
      const randomName = nomi[Math.floor(Math.random() * nomi.length)];
      const randomSurname = cognomi[Math.floor(Math.random() * cognomi.length)];
      const randomBirthday = getRandomDate();

      const user = await userFactory.createUser({
        email: `test${i}@example.com`,
        name: randomName,
        surname: randomSurname,
        birthday: randomBirthday,
      });
      testUserIds.push(user.id);
      users.push(user);
    }

    const birthdayToday = new Date();
    birthdayToday.setFullYear(1990);

    const userWithTodayBirthday = await userFactory.createUser({
      email: "birthday@example.com",
      name: nomi[Math.floor(Math.random() * nomi.length)],
      surname: cognomi[Math.floor(Math.random() * cognomi.length)],
      birthday: birthdayToday,
    });
    testUserIds.push(userWithTodayBirthday.id);
    users.push(userWithTodayBirthday);

    const allUsers = await prisma.user.findMany({
      where: {
        id: {
          in: testUserIds,
        },
      },
    });
    expect(allUsers.length).toBe(5);

    const { birthdayUsers } = await userFactory.findBirthdayUsers();
    expect(birthdayUsers.length).toBeGreaterThan(0);
  });
});
