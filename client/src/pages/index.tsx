import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';
import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/core";
import NextLink from 'next/link';
import { useState } from "react";
import UpdootSection from "../components/UpdootSection";


const Index = () => {
  const [variables, setVariables] = useState({ limit: 10, cursor: null as null | string })
  const [{ data, fetching }] = usePostsQuery({ variables })

  if (!fetching && !data) return <div>You got query failed for some reason</div>

  return (
    <Layout>
      <Flex mb={4}>
        <Heading>liReddit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create post</Link>
        </NextLink>
      </Flex>


      <Stack spacing={8} mb={4}>
        {!data && fetching ? <div>Loading...</div> : data!.posts.posts.map(p => (
          <Flex key={p.id} p={5} shadow={'md'} borderWidth="1px">
            <UpdootSection post={p}/>
            <Box>
              <Heading fontSize={'xl'}>{p.title}</Heading>
              <Text>{p.creator.username}</Text>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box>
          </Flex>
        ))}
      </Stack>

      {data && data.posts.hasMore ? (
        <Flex>
          <Button onClick={() => {
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
