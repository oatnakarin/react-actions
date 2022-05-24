FROM node:14
WORKDIR /backend
COPY package*.json ./
COPY ./server/ ./
RUN npm install
COPY . .
EXPOSE 4000
CMD [ "node", "server.js"]