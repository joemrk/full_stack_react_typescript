import { Box, Button, Flex, Link } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import InputField from '../../components/inputField';
import { Wrapper } from '../../components/Wrapper';
import { MeDocument, MeQuery, useChangePasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import { withApollo } from '../../utils/wthApollo';

const ChangePassword: NextPage = ({ }) => {
  const router = useRouter()
  const [changePassword] = useChangePasswordMutation()
  const [tokenError, setTokenError] = useState('')

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            variables: {
              newPassword: values.newPassword,
              token: typeof router.query.token === 'string' ? router.query.token : ''
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.changePassword.user
                }
              })
            }
          })
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

export default withApollo({ ssr: false })(ChangePassword)