import { Flex, IconButton } from '@chakra-ui/core';
import React, { useState } from 'react'
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
  post: PostSnippetFragment
}

const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loading, setLoading] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading')
  const [, vote] = useVoteMutation()
  
  return (
    <Flex justifyContent={'center'} alignItems={'center'} direction={'column'} pr={4}>
      <IconButton
        onClick={async () => {
          if(post.voteStatus === 1) return;
          setLoading('updoot-loading')
          await vote({
            postId: post.id,
            value: 1
          })
          setLoading('not-loading')
        }}
        variantColor={post.voteStatus === 1 ? 'green' : undefined}
        isLoading={loading === 'updoot-loading'}
        aria-label="updoot post"
        icon="chevron-up" />
      {post.points}
      <IconButton
        onClick={async () => {
          if(post.voteStatus === -1) return;
          setLoading('downdoot-loading')
          await vote({
            postId: post.id,
            value: -1
          })
          setLoading('not-loading')
        }}
        variantColor={post.voteStatus === -1 ? 'red' : undefined}
        isLoading={loading === 'downdoot-loading'}
        aria-label="downdoot post"
        icon="chevron-down" />
    </Flex>
  );
}
export default UpdootSection