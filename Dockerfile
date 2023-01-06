FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=production

RUN npm clean-install --omit=dev && npm cache clean --force

COPY . .

CMD [ "npm", "start" ]
