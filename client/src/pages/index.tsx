import NavBar from "../components/NavBar"
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';
import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/core";
import NextLink from 'next/link';
import { useState } from "react";


const Index = () => {
  const  [variables, setVariables] = useState({limit: 10, cursor: null as null | string})
  const [{ data, fetching }] = usePostsQuery({variables})
    
  if (!fetching && !data) return <div>You got query failed for some reason</div>

  return (
    <Layout>
      <Box mb={4}>
        <NextLink href="/create-post">
          <Link>Create post</Link>
        </NextLink>
      </Box>


      <Stack spacing={8}  mb={4}>
        {!data && fetching ? <div>Loading...</div> : data!.posts.posts.map(p => (
          <Box key={p.id} p={5} shadow={'md'} borderWidth="1px">
            <Heading fontSize={'xl'}>{p.title}</Heading>
            <Text mt={4}>{p.textSnippet}</Text>
          </Box>
        ))}
      </Stack>

      {data && data.posts.hasMore ? (
        <Flex>
          <Button onClick={()=>{
            setVariables({
              limit: variables.limit,
              cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
            })
          }} isLoading={fetching} m={'auto'} my={4}>Load more</Button>
        </Flex>
      ) : null}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(Index)
