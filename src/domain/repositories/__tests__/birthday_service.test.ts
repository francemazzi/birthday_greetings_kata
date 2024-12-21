import { BirthdayService } from "../birthday_service";
import { EmailService } from "../../../application/services/email_service_model";
import { UserFactory } from "../user_factory";

jest.mock("../../../application/services/email_service_model");
jest.mock("../user_factory");

describe("BirthdayService", () => {
  let birthdayService: BirthdayService;
  let emailService: jest.Mocked<EmailService>;
  let userFactory: jest.Mocked<UserFactory>;

  beforeEach(() => {
    jest.clearAllMocks();

    birthdayService = new BirthdayService();
    emailService = new EmailService() as jest.Mocked<EmailService>;
    userFactory = new UserFactory() as jest.Mocked<UserFactory>;
  });

  it("dovrebbe gestire il caso in cui non ci sono compleanni oggi", async () => {
    (UserFactory.prototype.findBirthdayUsers as jest.Mock).mockResolvedValue({
      birthdayUsers: [],
      count: 0,
    });
    (EmailService.prototype.verifyConnection as jest.Mock).mockResolvedValue(
      true
    );

    const result = await birthdayService.sendBirthdayWishes();

    expect(result).toEqual({
      success: true,
      message: "Nessun compleanno oggi",
      birthdayWishesSent: 0,
    });
  });

  it("dovrebbe gestire il caso di errore di connessione SMTP", async () => {
    (EmailService.prototype.verifyConnection as jest.Mock).mockResolvedValue(
      false
    );

    const result = await birthdayService.sendBirthdayWishes();

    expect(result).toEqual({
      success: false,
      message: "Impossibile connettersi al server SMTP",
      birthdayWishesSent: 0,
    });
  });

  it("dovrebbe inviare correttamente gli auguri di compleanno", async () => {
    const mockUsers = [
      { email: "user1@test.com", getFullName: () => "User 1" },
      { email: "user2@test.com", getFullName: () => "User 2" },
    ];

    (UserFactory.prototype.findBirthdayUsers as jest.Mock).mockResolvedValue({
      birthdayUsers: mockUsers,
      count: 2,
    });
    (EmailService.prototype.verifyConnection as jest.Mock).mockResolvedValue(
      true
    );
    (EmailService.prototype.sendEmail as jest.Mock).mockResolvedValue(true);

    const result = await birthdayService.sendBirthdayWishes();

    expect(result).toEqual({
      success: true,
      message: "Inviati 2 messaggi di auguri su 2 totali",
      birthdayWishesSent: 2,
    });
    expect(EmailService.prototype.sendEmail).toHaveBeenCalledTimes(2);
  });

  it("dovrebbe gestire errori durante l'invio delle email", async () => {
    const mockUsers = [
      { email: "user1@test.com", getFullName: () => "User 1" },
      { email: "user2@test.com", getFullName: () => "User 2" },
    ];

    (UserFactory.prototype.findBirthdayUsers as jest.Mock).mockResolvedValue({
      birthdayUsers: mockUsers,
      count: 2,
    });
    (EmailService.prototype.verifyConnection as jest.Mock).mockResolvedValue(
      true
    );
    (EmailService.prototype.sendEmail as jest.Mock)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    const result = await birthdayService.sendBirthdayWishes();

    expect(result).toEqual({
      success: true,
      message: "Inviati 1 messaggi di auguri su 2 totali",
      birthdayWishesSent: 1,
    });
    expect(EmailService.prototype.sendEmail).toHaveBeenCalledTimes(2);
  });
});
