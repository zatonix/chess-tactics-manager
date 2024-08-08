# Use the official Node.js 22 image
FROM node:22-alpine

WORKDIR /app

COPY ./prisma ./prisma
COPY chesscom-synchronizer/tsconfig.json .
COPY chesscom-synchronizer/package*.json .
COPY chesscom-synchronizer/src src/

RUN npm install

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "compile"]