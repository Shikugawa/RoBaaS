FROM node:10.6.0-slim
WORKDIR /app
COPY package.json /app
RUN npm install && npm cache verify
COPY . /app

CMD ["npm", "run", "start-dev"]