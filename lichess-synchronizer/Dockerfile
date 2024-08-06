# Use the official Node.js 22 image
FROM node:22-alpine

WORKDIR /app

COPY ./prisma ./prisma
COPY lichess-synchronizer/tsconfig.json .
COPY lichess-synchronizer/package*.json .
COPY lichess-synchronizer/src src/

RUN npm install

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "compile"]