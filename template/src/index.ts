// @see https://www.apollographql.com/docs/apollo-server/integrations/middleware/
import express, { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';

const app    = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app, path: '/graphql' });

function hello(req: Request, res: Response) {
  res.status(200);
  res.send('Hello!');
  res.end();
}

app.use(hello);

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
