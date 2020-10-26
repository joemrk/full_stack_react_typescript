import 'reflect-metadata'
import { MikroORM } from '@mikro-orm/core'
import { __prod__, COOKIE_NAME } from './constants';
import microOrmConfig from './mikro-orm.config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import cors from 'cors'


const main = async () => {
  const orm = await MikroORM.init(microOrmConfig)
  // await orm.em.nativeDelete(User,{})
  await orm.getMigrator().up()


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
    context: ({ req, res }) => ({ em: orm.em, req, res, redis })
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

