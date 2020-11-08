import { Button, Flex, Link } from '@chakra-ui/core'
import { Form, Formik } from "formik"
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React from 'react'
import InputField from '../components/inputField'
import { Wrapper } from '../components/Wrapper'
import { useLoginMutation, MeDocument, MeQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient'
import { toErrorMap } from '../utils/toErrorMap'
import NextLink from 'next/link';
import { withApollo } from '../utils/wthApollo'

const Login: React.FC<{}> = ({ }) => {
  const router = useRouter()
  const [login] = useLoginMutation()


  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.login.user
                }
              }),
              cache.evict({fieldName: 'posts:{}'})
            }
          })
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors))
          } else if (response.data?.login.user) {
            if (typeof router.query.next === 'string') router.push(router.query.next)
            else router.push('/')
          }
        }} >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              placeholder='Username or email'
              name='usernameOrEmail'
              label='Username or email'
            />
            <InputField
              placeholder='Password'
              name='password'
              label='Password'
              type='password'
            />
            <Flex mt={2}>
              <NextLink href='/forgot-password'>
                <Link ml={'auto'}>forgot password</Link>
              </NextLink>
            </Flex>
            <Button type='submit' mt={5} mx='auto' variantColor='teal' isLoading={isSubmitting}>Login</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}
export default withApollo({ ssr: false })(Login)