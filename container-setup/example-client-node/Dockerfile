from node:14-alpine

ARG port
ENV PORT=${port}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["sh", "-c", "node index.js"]