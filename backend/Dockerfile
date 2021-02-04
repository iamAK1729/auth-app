FROM node:12.14.1-slim
RUN apt-get -qy update && apt-get -qy install openssl
RUN npm install -g --unsafe-perm prisma

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Bundle app source
COPY src ./src/
COPY profilePictureUploads ./profilePictureUploads/

ENV DATABASE_URL "$DATABASE_URL"

RUN npm install

RUN prisma migrate dev --preview-feature
RUN prisma generate

CMD ["npm", "start" ]