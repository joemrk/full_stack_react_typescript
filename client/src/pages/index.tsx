import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/core';
import NextLink from 'next/link';
import EditDeletePostButtons from '../components/EditDeletePostButtons';
import { Layout } from '../components/Layout';
import UpdootSection from "../components/UpdootSection";
import { PostsQuery, usePostsQuery } from '../generated/graphql';
import { withApollo } from '../utils/wthApollo';


const Index = () => {
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 10,
      cursor: null
    },
    notifyOnNetworkStatusChange: true
  })

  if (!loading && !data) return (
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
        {!data && loading ? <div>Loading...</div> : data!.posts.posts.map(p =>
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
            fetchMore({
              variables: {
                limit: variables?.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
              },
              // updateQuery: (
              //   previousValue,
              //   { fetchMoreResult }
              // ): PostsQuery => {
              //   if (!fetchMoreResult) {
              //     return previousValue as PostsQuery;
              //   }

              //   return {
              //     __typename: "Query",
              //     posts: {
              //       __typename: "PaginatedPosts",
              //       hasMore: (fetchMoreResult as PostsQuery).posts.hasMore,
              //       posts: [
              //         ...(previousValue as PostsQuery).posts.posts,
              //         ...(fetchMoreResult as PostsQuery).posts.posts,
              //       ],
              //     },
              //   };
              // },


            })
          }} isLoading={loading} m={'auto'} my={4}>Load more</Button>
        </Flex>
      ) : null}
    </Layout>
  )
}

export default withApollo({ssr: true})(Index)
