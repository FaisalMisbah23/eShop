FROM node:18
WORKDIR /socket
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 6000
CMD ["node", "index.js"]
