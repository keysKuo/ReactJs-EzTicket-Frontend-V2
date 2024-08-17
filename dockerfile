# FROM node:18.16.0-alpine3.17

# WORKDIR /usr/src/app

# COPY . .

# RUN npm install

# EXPOSE 3000

# CMD [ "npm", "start" ]

FROM node:14.14.0-alpine as builder
WORKDIR /usr/src/app
COPY ./package.json ./
RUN npm i
COPY . .
RUN npm run build

# FROM nginx
# EXPOSE 3000
# COPY ../nginx/default.conf /etc/nginx/conf.d/default.conf
# COPY --from=builder /app/build /usr/share/nginx/html
