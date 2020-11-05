import React from 'react'
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import { Box, Heading, Text } from '@chakra-ui/core';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import EditDeletePostButtons from '../../components/EditDeletePostButtons';

const Post: React.FC<{}> = () => {
  const router = useRouter()
  const [{data, fetching}] = useGetPostFromUrl()

  if (fetching) return <Layout>Loading...</Layout>
  if(!data?.post) return <Layout><Box>Post non found.</Box></Layout>
  
  return(
  <Layout>
    <Heading mb={4}>{data.post.title}</Heading>
    <Box mb={8}><Text>{data.post.text}</Text></Box>

    <EditDeletePostButtons id={data.post.id} creatorId={data.post.creator.id} />

  </Layout>
  )
}
export default withUrqlClient(createUrqlClient, { ssr: true })(Post)