import { MeQuery, LoginMutation, MeDocument, RegisterMutation, LogoutMutation } from './../generated/graphql';
import { dedupExchange, fetchExchange } from "urql"
import { updateQuery } from './updateQuery';
import { cacheExchange } from '@urql/exchange-graphcache';
import {pipe, tap} from 'wonka'
import {Exchange} from 'urql'
import Router from 'next/router';

const errorExchange: Exchange = ({forward}) => (ops$) =>{
  return pipe(
    forward(ops$),
    tap(({error})=>{
      if (error?.message.includes('Not authenticated')) {
        Router.replace('/login')
      }
    })
  )
}


export const createUrqlClient = (ssrExchanges: any)=>({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const 
  },
  exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        login: (_result, args, cache, info) => {
          updateQuery<LoginMutation, MeQuery>(cache,
            { query: MeDocument },
            _result,
            (result, query) => {
              if (result.login.errors) return query
              else return { me: result.login.user }
            }
          )
        },
        register: (loginResult, args, cache, info) => {
          updateQuery<RegisterMutation, MeQuery>(cache,
            { query: MeDocument },
            loginResult,
            (result, query) => {
              if (result.register.errors) return query
              else return { me: result.register.user }
            }
          )
        },
        logout: (_result, args, cache, info) => {
          updateQuery<LogoutMutation, MeQuery>(
            cache,
            { query: MeDocument },
            _result,
            () => ({ me: null })
          )
        }
      }
    }
  }), errorExchange, ssrExchanges, fetchExchange],
})