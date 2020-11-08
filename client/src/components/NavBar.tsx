import { Box, Button, Flex, Heading, Link } from '@chakra-ui/core';
import React from 'react'
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import NextLink from 'next/link';
import { useRouter } from 'next/router'
import { useApolloClient } from '@apollo/client';

interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({ }) => {
  const router = useRouter()
  const [logout, { loading: logoutFetching } ] = useLogoutMutation()
  const apolloClient = useApolloClient()
  const { data, loading } = useMeQuery({
    skip: isServer()
  })
  let body = null

  if (loading) { }
  else if (!data?.me) {
    body = (
      <>
        <NextLink href='/login'>
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href='/register'>
          <Link mr={2}>Registration</Link>
        </NextLink>
      </>
    )
  }
  else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          variant={'link'}
          color='black'
          onClick={async () => {
            await logout()
            await apolloClient.resetStore()
          }}
          isLoading={logoutFetching}>Logout</Button>
      </Flex>
    )
  }


  return (
    <Flex zIndex={1} position='sticky' top={0} bg='grey' p={4} align='center'>
      <NextLink href='/'>
        <Link>
          <Heading>LiReddit</Heading>
        </Link>
      </NextLink>
      <Box ml='auto'> {body} </Box>
    </Flex>
  );
}
export default NavBar