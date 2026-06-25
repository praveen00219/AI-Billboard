FROM node:20

WORKDIR /myapp

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

# RUN npm start

CMD ["npm", "run", "dev", "--", "--host"]
