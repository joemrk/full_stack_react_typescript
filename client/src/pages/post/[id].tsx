import { Box, Heading, Text } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import EditDeletePostButtons from '../../components/EditDeletePostButtons';
import { Layout } from '../../components/Layout';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { withApollo } from '../../utils/wthApollo';

const Post: React.FC<{}> = () => {
  const router = useRouter()
  const {data, loading} = useGetPostFromUrl()

  if (loading) return <Layout>Loading...</Layout>
  if(!data?.post) return <Layout><Box>Post non found.</Box></Layout>
  
  return(
  <Layout>
    <Heading mb={4}>{data.post.title}</Heading>
    <Box mb={8}><Text>{data.post.text}</Text></Box>

    <EditDeletePostButtons id={data.post.id} creatorId={data.post.creator.id} />

  </Layout>
  )
}
export default withApollo({ssr: true})(Post)