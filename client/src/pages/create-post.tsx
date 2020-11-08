import React from 'react';
import { Form, Formik } from 'formik';
import InputField from '../components/inputField';
import { Button} from '@chakra-ui/core';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';
import { useCreatePostMutation } from '../generated/graphql';
import { Layout } from '../components/Layout';
import { useIsAuth } from '../utils/useIsAuth';
import { useRouter } from 'next/router';
import { withApollo } from '../utils/wthApollo';

const CreatePst:React.FC<{}> = ({}) =>{
  const router = useRouter()
  const [createPost] = useCreatePostMutation()
  useIsAuth()
  return(
    <Layout variant="small">
    <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values, { setErrors }) => {
          const {errors} = await createPost({
            variables: {
              input: values
            },
            update: (cache) =>{
              cache.evict({fieldName: 'posts:{}'})
            }
          })
          

            if(!errors){
              router.push('/')
            }
        }}
      >
        {({ isSubmitting }) => (
            <Form>
              <InputField
                placeholder='Title'
                name='title'
                label='Title'
              />
              <InputField
                textarea
                placeholder='type body text'
                name='text'
                label='Body'
              />
             
              <Button type='submit' mt={5} mx='auto' variantColor='teal' isLoading={isSubmitting}>Create</Button>
            </Form>
          )}
      </Formik>
    </Layout>
  )
}

export default withApollo({ssr: false})(CreatePst)