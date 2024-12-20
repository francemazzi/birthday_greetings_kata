# Birthday greetings kata

Esercizio tecnico di API server basato su Express.js, TypeScript, Prisma e PostgreSQL.
L'obiettivo è sviluppare una piccola applicazione per inviare automaticamente auguri alle persone che compiono gli anni.

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

## 📝 License

MIT License - vedere il file LICENSE per i dettagli
