# Use the official Node.js 22 image
FROM node:22-alpine

WORKDIR /app

COPY ./prisma ./prisma
COPY chess-analysis/tsconfig.json .
COPY chess-analysis/package*.json .
COPY chess-analysis/src src/

RUN npm install

RUN npx prisma generate

EXPOSE 3000

RUN npm run build

CMD ["npm", "run", "start"]