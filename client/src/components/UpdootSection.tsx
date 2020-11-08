import { ApolloCache } from '@apollo/client';
import { Flex, IconButton } from '@chakra-ui/core';
import gql from 'graphql-tag';
import React, { useState } from 'react'
import { PostSnippetFragment, useVoteMutation, VoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
  post: PostSnippetFragment
}

const updateAfterVote = (value: number, postId: number, cache: ApolloCache<VoteMutation>) => {
  const data = cache.readFragment<{
    id: number
    points: number
    voteStatus: number
  }>({
    id: 'Post:' + postId,
    fragment: gql`
      fragment _ on Post{
        id
        points
        voteStatus
      }
    `,
  })

  if (data) {
    if (data.voteStatus === value) {
      return;
    }
    const newPoints = (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
    cache.writeFragment({
      id: 'Post:' + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value }
    });
  }
}

const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loading, setLoading] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading')
  const [vote] = useVoteMutation()

  return (
    <Flex justifyContent={'center'} alignItems={'center'} direction={'column'} pr={4}>
      <IconButton
        onClick={async () => {
          if (post.voteStatus === 1) return;
          setLoading('updoot-loading')
          await vote({
            variables: {
              postId: post.id,
              value: 1
            },
            update: cache => updateAfterVote(1, post.id, cache)
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
          if (post.voteStatus === -1) return;
          setLoading('downdoot-loading')
          await vote({
            variables: {
              postId: post.id,
              value: -1
            },
            update: cache => updateAfterVote(-1, post.id, cache)

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