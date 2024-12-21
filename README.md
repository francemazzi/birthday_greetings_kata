# Birthday Greetings Kata by frama

Un'applicazione server API per l'invio automatico di auguri di compleanno, sviluppata con Express.js, TypeScript, Prisma e PostgreSQL.

## 🎯 Obiettivo del Progetto

Sviluppare un'applicazione che:

- Carica dati dei dipendenti da un file CSV
- Invia automaticamente email di auguri a chi compie gli anni
- Gestisce i dati in modo flessibile e testabile

### Formato File CSV

```csv
cognome, nome, data_di_nascita, email
Rossi, Mario, 1982/10/08, mario.rossi@esempio.com
Bianchi, Anna, 1975/09/11, anna.bianchi@esempio.com
```

## 🚀 Guida Rapida all'Installazione

### Prerequisiti

- Node.js (≥ 14.0.0)
- Docker e Docker Compose
- PostgreSQL

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

## 📡 API Disponibili

### Test delle API

Documentazione Swagger: http://localhost:8000/api-docs

#### Principali Endpoint:

- **POST** `/file/upload` - Caricamento CSV dipendenti
- **POST** `/user/send-birthday-email` - Invio auguri automatici
- **GET** `/api/users` - Lista utenti
- **POST** `/api/auth/login` - Accesso utente

### Test Invio Email

Utilizzare MailHog (http://localhost:8025) per verificare l'invio delle email.

Esempio di test:

```bash
curl -X POST http://localhost:8000/email/send \
-H "Content-Type: application/json" \
-d '{
  "to": "test@esempio.com",
  "subject": "Email di Test",
  "contenuto": "Questo è un test"
}'
```

### 🔐 Autenticazione

Il sistema utilizza JWT (JSON Web Tokens) per l'autenticazione. Include:

- Token di accesso con scadenza 30 giorni

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

## 📄 Licenza

Copyright (c) 2024 Francesco Saverio Mazzi

È concessa gratuitamente l'autorizzazione a qualsiasi persona che ottenga una copia di questo software e dei file di documentazione associati (il "Software"), di trattare il Software senza restrizioni, inclusi, senza limitazione, i diritti di utilizzare, copiare, modificare, unire, pubblicare, distribuire, sublicenziare e/o vendere copie del Software, e di permettere alle persone a cui il Software è fornito di farlo, alle seguenti condizioni:

L'avviso di copyright di cui sopra e questo avviso di autorizzazione devono essere inclusi in tutte le copie o parti sostanziali del Software.

IL SOFTWARE VIENE FORNITO "COSÌ COM'È", SENZA GARANZIE DI ALCUN TIPO, ESPLICITE O IMPLICITE, INCLUSE MA NON LIMITATE ALLE GARANZIE DI COMMERCIABILITÀ, IDONEITÀ PER UN PARTICOLARE SCOPO E NON VIOLAZIONE. IN NESSUN CASO GLI AUTORI O I TITOLARI DEL COPYRIGHT SARANNO RESPONSABILI PER QUALSIASI RECLAMO, DANNO O ALTRA RESPONSABILITÀ, SIA IN UN'AZIONE DI CONTRATTO, TORTO O ALTRO, DERIVANTE DA, FUORI O IN CONNESSIONE CON IL SOFTWARE O L'USO O ALTRE OPERAZIONI NEL SOFTWARE.
