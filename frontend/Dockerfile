# build environment
FROM node:13.12.0-alpine as build
WORKDIR /app
COPY package.json /app/
COPY package-lock.json /app/
RUN npm install
COPY . .
RUN ls
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build app/build /bin/www
# new
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]