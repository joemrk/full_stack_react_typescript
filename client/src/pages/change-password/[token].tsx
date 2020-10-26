import { NextPage } from 'next';
import React, { useState } from 'react'
import { Wrapper } from '../../components/Wrapper';
import { Form, Formik } from 'formik';
import InputField from '../../components/inputField';
import { Box, Button, Flex, Link } from '@chakra-ui/core';
import { toErrorMap } from '../../utils/toErrorMap';
import { useRouter } from 'next/router';
import { useChangePasswordMutation } from '../../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import NextLink from 'next/link';

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter()
  const [, changePassword] = useChangePasswordMutation()
  const [tokenError, setTokenError] = useState('')

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({ newPassword: values.newPassword, token })
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors)
            if ('token' in errorMap) {
              setTokenError(errorMap.token)
            }
            setErrors(errorMap)
          } else if (response.data?.changePassword.user) {
            router.push('/')
            // }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              placeholder='New password'
              name='newPassword'
              label='New password'
              type="password"
            />
            {tokenError &&
              <Flex>
                <Box mr={2} style={{ color: 'red' }}>{tokenError}</Box>
                <NextLink href='/forgot-password'>
                  <Link>get a new one</Link>
                </NextLink>
              </Flex>
            }
            <Button type='submit' mt={5} mx='auto' variantColor='teal' isLoading={isSubmitting}>Change password</Button>
          </Form>
        )}
      </Formik>

    </Wrapper>
  );
}

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string
  }
}
export default withUrqlClient(createUrqlClient)(ChangePassword)