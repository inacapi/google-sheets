FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm clean-install --omit=dev && npm cache clean --force

COPY . .

CMD [ "npm", "start" ]
