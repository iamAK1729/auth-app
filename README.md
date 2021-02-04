# Authentication App

## Technology stack:

### Frontend: 
ReactJS, ReactRouter, LESS, Webpack, Prisma Client.

### Backend:
NodeJS, ExpressJS, bcryptjs, JWT, GraphQL, MySQL, Prisma.

## Quick Overview:
The app allows users to signup/login to find their details on the dashboard.
The frontend and backend code are included in the same repository respectively.
The App has been containerized using Docker.

### Please find the instructions below on how you can run the app.

#### Prerequisites:
NodeJS, Docker

#### From the terminal:

```sh
git clone https://github.com/iamAK1729/auth-app.git
cd auth-app
npm run build
npm run start
```

#### In a new terminal tab (command promt for windows)
```sh
docker exec -it prisma bash
```
#### OR
You can use docker dashboard and click on CLI icon of prisma container.

Once inside the prisma docker container:
```sh
cd prisma
prisma migrate dev --name "init" --preview-feature
```

At this point `migrations` should be seen in prisma directory (you can type **ls** to verify).

#### Now you should be able to go to 

**http://localhost** to see the app live.

**http://localhost:4000/graphql** to interact graphql playground (you can run queries and mutations using graphql here).

**http://localhost:5555** to interact with prisma studio (you can see/modify the contents of existing data here).

