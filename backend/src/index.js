const express = require("express");
const { ApolloServer } = require("apollo-server-express");

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const { getUserId } = require("./utils");

const prisma = new PrismaClient();

const resolvers = {
  Query,
  Mutation,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

const PORT = process.env.PORT;

const app = express();

server.applyMiddleware({ app });

app.use(
  "/images/profilePictureUploads",
  express.static("profilePictureUploads")
);

app.use((req, res) => {
  res.status(200);
  res.send("200 OK");
  res.end();
});

app.listen({ port: PORT }, () =>
  console.log(`Serving at http://localhost:${PORT}${server.graphqlPath}`)
);
