import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../../../components/inputField';
import { Layout } from '../../../components/Layout';
import { usePostQuery, useUpdatePostMutation } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useGetIntId } from '../../../utils/useGetIntId';


const EditPost: React.FC<{}> = ({ }) => {
  const router = useRouter()
  const postId = useGetIntId()
  const [{ data, fetching }] = usePostQuery({
    pause: postId === -1,
    variables: {
      id: postId
    }
  })
  const [, updatePost] = useUpdatePostMutation()

  if (fetching) return <Layout>Loading...</Layout>
  if (!data?.post) return <Layout><Box>Post non found.</Box></Layout>

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          await updatePost({ id: postId, ...values })
          router.back()
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

            <Button
              type='submit'
              mt={5} mx='auto'
              variantColor='teal'
              isLoading={isSubmitting}>Save</Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient)(EditPost)
