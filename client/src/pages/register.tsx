import { Button } from '@chakra-ui/core'
import { Form, Formik } from "formik"
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React from 'react'
import InputField from '../components/inputField'
import { Wrapper } from '../components/Wrapper'
import { useRegisterMutation } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { toErrorMap } from '../utils/toErrorMap'

interface registerProps { }

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter()
  const [,register] = useRegisterMutation()


  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: '', password: '', email: '' }}
        onSubmit={async (values, {setErrors}) => {
          const response = await register({ options: values })
          if(response.data?.register.errors){
            setErrors(toErrorMap(response.data.register.errors))
          } else if(response.data?.register.user){
            router.push('/')
          }
        }}
      >
        {({ values, errors, touched,
          handleChange, handleBlur, handleSubmit,
          isSubmitting }) => (
            <Form>
              <InputField
                placeholder='username'
                name='username'
                label='Username'
              />
               <InputField
                placeholder='email'
                name='email'
                label='Email'
              />
              <InputField 
                placeholder='password'
                name='password'
                label='Password'
                type='password'
              />
            <Button type='submit' mt={5} mx='auto' variantColor='teal' isLoading={isSubmitting}>Register</Button>
            </Form>
          )}
      </Formik>

    </Wrapper>


  );
}
export default withUrqlClient(createUrqlClient)(Register)