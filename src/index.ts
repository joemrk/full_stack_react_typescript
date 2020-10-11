import 'reflect-metadata'
import { MikroORM } from '@mikro-orm/core'
import { __prod__ } from './constants'
// import { Post } from './entities/Post'
import microOrmConfig from './mikro-orm.config'
import express from 'express'
import {ApolloServer} from 'apollo-server-express'
import {buildSchema} from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user'


// const PORT = process.env.PORT || 5000

const main = async () => {
  const orm = await MikroORM.init(microOrmConfig)
  await orm.getMigrator().up()

  const app = express()
  const apollosServer = new  ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: ()=> ({em: orm.em})
  })
  apollosServer.applyMiddleware({app})

  // app.get('/', (_, res)=>{
  //   res.status(200).json({data: 'hello'})
  // })


  app.listen(4000, () => {
    console.log(`Server has been started on localhost:4000`);
  })
  // const posta = orm.em.create(Post, {title: 'first posta 22'})
  // await orm.em.persistAndFlush(posta)

  // const posts = await orm.em.find(Post, {})
  // console.log(posts);

}

main()

