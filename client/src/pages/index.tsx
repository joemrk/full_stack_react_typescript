import NavBar from "../components/NavBar"
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';
import { Box, Link } from "@chakra-ui/core";
import NextLink from 'next/link';


const Index = () => {
  const [{ data }] = usePostsQuery(
    {
      variables: { limit: 10 }
    }
  )

  return (
    <Layout>
      <Box mb={4}>
        <NextLink href="/create-post">
          <Link>Create post</Link>
        </NextLink>
      </Box>

      {!data ? <div>Loading...</div> : data.posts.map(p => <div key={p.id}>{p.title}</div>)}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(Index)
