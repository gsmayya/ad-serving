FROM node:24-alpine

WORKDIR /
COPY package*.json ./
COPY *config.js ./

RUN npm install
COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
