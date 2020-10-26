import { Button, Flex, Link } from '@chakra-ui/core'
import { Form, Formik } from "formik"
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React from 'react'
import InputField from '../components/inputField'
import { Wrapper } from '../components/Wrapper'
import { useLoginMutation } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { toErrorMap } from '../utils/toErrorMap'
import NextLink from 'next/link';

interface registerProps { }

const Login: React.FC<{}> = ({ }) => {
  const router = useRouter()
  const [, login] = useLoginMutation()


  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values)
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors))
          } else if (response.data?.login.user) {
            router.push('/')
          }
        }}
      >
        {({ values, errors, touched,
          handleChange, handleBlur, handleSubmit,
          isSubmitting }) => (
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
export default withUrqlClient(createUrqlClient)(Login)