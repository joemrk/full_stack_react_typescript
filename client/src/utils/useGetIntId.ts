import { useRouter } from 'next/router';

export const useGetIntId = () =>{
  const router = useRouter()
  const postId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
  return postId
}