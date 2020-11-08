import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useState } from "react";
import EditDeletePostButtons from '../components/EditDeletePostButtons';
import { Layout } from '../components/Layout';
import UpdootSection from "../components/UpdootSection";
import { useDeletePostMutation, useMeQuery, usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from "../utils/createUrqlClient";


const Index = () => {
  const [variables, setVariables] = useState({ limit: 10, cursor: null as null | string })
  const [{ data: meData }] = useMeQuery()
  const [{ data, error, fetching }] = usePostsQuery({ variables })
  const [, deletePost] = useDeletePostMutation()


  if (!fetching && !data) return (
    <div>
      <div>You got query failed for some reason</div>
      <div>{error?.message}</div>
    </div>
  )

  return (
    <Layout>
      <Flex mb={4}>
        <Heading>liReddit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create post</Link>
        </NextLink>
      </Flex>

      <Stack spacing={8} mb={4}>
        {!data && fetching ? <div>Loading...</div> : data!.posts.posts.map(p =>
          !p ? null : (
            <Flex key={p.id} p={5} shadow={'md'} borderWidth="1px">
              <UpdootSection post={p} />
              <Box flex={1}>
                <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                  <Link>
                    <Heading fontSize={'xl'}>{p.title}</Heading>
                  </Link>
                </NextLink>
                <Flex justifyContent='space-between'>
                  <Box>
                    <Text>{p.creator.username}</Text>
                    <Text mt={4}>{p.textSnippet}</Text>
                  </Box>
                  <EditDeletePostButtons id={p.id} creatorId={p.creator.id} />

                </Flex>
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

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
