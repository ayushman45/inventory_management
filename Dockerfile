FROM node:23.5.0

WORKDIR /app

COPY . .

RUN npm i

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]