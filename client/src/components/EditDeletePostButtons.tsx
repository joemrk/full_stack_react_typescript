import { Box, IconButton, Link } from '@chakra-ui/core';
import React from 'react'
import { useMeQuery, useDeletePostMutation } from '../generated/graphql';
import NextLink from 'next/link';

interface EditDeletePostButtonsProps {
  id: number,
  creatorId: number
}

const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({ id, creatorId }) => {
  const { data: meData } = useMeQuery()
  const [deletePost] = useDeletePostMutation()

  if (meData?.me?.id !== creatorId) return null

  return (
    <Box>
      <NextLink href='/post/edit/[id]' as={`/post/edit/${id}`}>
        <IconButton
          mr={2}
          as={Link}
          icon='edit'
          variantColor='blue'
          aria-label='Edit post'
        />
      </NextLink>
      <IconButton
        icon='delete'
        variantColor='red'
        aria-label='Delete post'
        onClick={() => {
          deletePost({ variables: {id}, update: (cache) =>{
            cache.evict({id: 'Post:'+ id})
          } })
        }} />
    </Box>
  )
}
export default EditDeletePostButtons