import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { COOKIE_NAME, __prod__ } from './constants';
import { Post } from './entities/Post';
import { User } from './entities/User';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import path from 'path'

const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    database: 'node2',
    username: 'joemrk_node',
    password: 'qwerty',
    logging: true,
    synchronize: true,
    entities: [Post, User],
    migrations: [path.join(__dirname, './migrations/*')]
  })
//  await conn.runMigrations();
// await Post.delete({})

  const app = express()

  const RedisStore = connectRedis(session);
  const redis = new Redis()
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true

  }))
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: 'secret string for session',
      resave: false,
    })
  );

  const apollosServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }) => ({req, res, redis })
  })
  apollosServer.applyMiddleware({
    app,
    cors: false
  })

  app.listen(4000, () => {
    console.log(`Server has been started on http://localhost:4000`);
  })

}

main()

