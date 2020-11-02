import React from 'react'
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useRouter } from 'next/router';
import { usePostQuery } from '../../generated/graphql';
import { Layout } from '../../components/Layout';
import { Box, Heading, Text } from '@chakra-ui/core';

const Post: React.FC<{}> = () => {
  const router = useRouter()
  const postId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
  const [{data, fetching}] = usePostQuery({
    pause: postId === -1,
    variables: {
      id: postId
    } 
  })

  if (fetching) return <Layout>Loading...</Layout>
  if(!data?.post) return <Layout><Box>Post non found.</Box></Layout>
  
  return(
  <Layout>
    <Heading mb={4}>{data.post.title}</Heading>
    <Text>{data.post.text}</Text>
  </Layout>
  )
}
export default withUrqlClient(createUrqlClient, { ssr: true })(Post)