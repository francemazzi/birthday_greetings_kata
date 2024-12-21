FROM --platform=linux/amd64 node:20.1.0

WORKDIR /app

COPY package*.json ./

COPY tsconfig.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 8080

ENV PORT 8080

RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

USER pptruser

CMD ["npm", "run", "start"]