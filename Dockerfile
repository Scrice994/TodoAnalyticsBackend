FROM node:16-alpine3.18

COPY package*.json ./

WORKDIR /var/www/app

ENV NODE_ENV production

RUN npm ci --only=production

COPY . .

EXPOSE 5005

RUN npm run build

CMD ["npm","start"]