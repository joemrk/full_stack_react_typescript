import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import InputField from '../components/inputField';
import { Wrapper } from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';


const ForgotPassword: React.FC<{}> = ({ }) => {
  const [complete, setComplete] = useState(false)
  const [,forgotPassword] = useForgotPasswordMutation()
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: ''}}
        onSubmit={async (values) => {
          await forgotPassword({email: values.email})
          setComplete(true)
        }}
      >
        {({ isSubmitting }) => (
          complete ?<Box>If an account with that email exist, we sent you can email</Box> :
            <Form>
              <InputField
                placeholder='Email'
                name='email'
                label='Email'
                type='email'
              />
              <Button type='submit' mt={5} mx='auto' variantColor='teal' isLoading={isSubmitting}>Send Email</Button>
            </Form>
          )}
      </Formik>

    </Wrapper>


  );
}
export default withUrqlClient(createUrqlClient)(ForgotPassword)