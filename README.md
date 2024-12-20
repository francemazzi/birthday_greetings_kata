# Birthday greetings kata

Esercizio tecnico di API server basato su Express.js, TypeScript, Prisma e PostgreSQL.
L'obiettivo è sviluppare una piccola applicazione per inviare automaticamente auguri alle persone che compiono gli anni.

# Problem: write a program that

- Loads a set of employee records from a flat file
- Sends a greetings email to all employees whose birthday is today
- The flat file is a sequence of records, separated by newlines; this are the first few lines:

last_name, first_name, date_of_birth, email
Doe, John, 1982/10/08, john.doe@foobar.com
Ann, Mary, 1975/09/11, mary.ann@foobar.com

The greetings email contains the following text:

Subject: Happy birthday!

Happy birthday, dear John!
with the first name of the employee substituted for “John”

The program should be invoked by a main program like this one:

public static void main(String[] args) {
...
BirthdayService birthdayService = new BirthdayService(
employeeRepository, emailService);
birthdayService.sendGreetings(today());
}

Note that the collaborators of the birthdayService objects are injected in it. Ideally domain code should never use the new operator. The new operator is called from outside the domain code, to set up an aggregate of objects that collaborate together.

# Goals

The goal of this exercise is to come up with a solution that is

- Testable; we should be able to test the internal application logic with no need to ever send a real email.
- Flexible: we anticipate that the data source in the future could change from a flat file to a relational database, or perhaps a web service. We also anticipate that the email service could soon be replaced with a service that sends greetings through Facebook or some other social network.
- Well-designed: separate clearly the business logic from the infrastructure.

## 🚀 Avvio Rapido

### Prerequisiti

- Node.js (>= 14.0.0)
- Docker e Docker Compose
- PostgreSQL (per sviluppo locale)

### Installazione

1. **Setup del progetto**

   ```bash
   # Clona il repository
   git clone <url-repository>
   cd <nome-progetto>

   # Installa le dipendenze
   npm install
   ```

2. **Configurazione ambiente**

   - Copia il file `.env.example` in `.env`
   - Modifica le variabili d'ambiente secondo necessità

3. **Avvio con Docker**

   ```bash
   # Ambiente di sviluppo
   docker-compose up -d

   # Ambiente di produzione
   docker-compose -f docker-compose.prod.yml up -d
   ```

### 🛠 Sviluppo

- **Avvio in modalità sviluppo**

  ```bash
  npm run dev
  ```

- **Build del progetto**

  ```bash
  npm run build
  ```

- **Esecuzione test**
  ```bash
  npm test
  ```

### Setup prisma

- To generate new prisma project (it's not necessary): npx prisma generate
- The second thing you have to do is migrate a schema by: npx prisma migrate dev --name <name>
- To deploy in production (DON'T do it if you are not allowed by the owner of the project): npx prisma migrate deploy
- Introspect database and push data: npx prisma db pull
- If you want to seed data on database you have to write: npx prisma db seed

### 📚 API Documentation

L'API include i seguenti endpoint principali:

- **Auth**

  - POST `/api/auth/register` - Registrazione nuovo utente
  - POST `/api/auth/login` - Login utente

- **Users**
  - GET `/api/users` - Lista utenti
  - GET `/api/users/:id` - Dettagli utente
  - DELETE `/api/users/:id` - Elimina utente

### 🔐 Autenticazione

Il sistema utilizza JWT (JSON Web Tokens) per l'autenticazione. Include:

- Token di accesso con scadenza 30 giorni
- Middleware di autenticazione per route protette

### 🗄️ Database

- PostgreSQL come database principale
- Prisma come ORM
- Migrations automatiche con Docker Compose

### 🔧 Manutenzione

- **Backup Database**

  ```bash
  docker exec -t <container-name> pg_dump -U postgres mydb > backup.sql
  ```

- **Restore Database**
  ```bash
  docker exec -i <container-name> psql -U postgres mydb < backup.sql
  ```

## TEST to send email

We use mailhog to test the email sending. The steps are:

1. Run the docker compose file
2. Go to http://localhost:8025/ to see the emails sent

Use this curl:

```bash
curl -X POST http://localhost:8000/email/send \
-H "Content-Type: application/json" \
-d '{
  "to": "test@example.com",
  "subject": "Test Email",
  "content": "This is a test"
}'
```

## 📝 License

MIT License - vedere il file LICENSE per i dettagli
