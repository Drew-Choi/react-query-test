import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';

async function fetchComments(postId: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`,
  );
  console.log('댓글요청?');
  return response.json();
}

async function deletePost(postId: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: 'DELETE' },
  );
  return response.json();
}

async function updatePost(postId: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json', // 필요에 따라 적절한 Content-Type을 설정하세요.
      },
      body: JSON.stringify({ title: 'REACT QUERY FOREVER!!!!' }),
    },
  );
  return response.json();
}

export function PostDetail({ post }: { post: DataTypes }) {
  // replace with useQuery
  const {
    data,
    isError,
    isLoading,
    error,
  }: {
    data: CommentsType[] | undefined;
    isError: boolean;
    isLoading: boolean;
    error: Error | null;
  } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => fetchComments(post.id),
  });

  const deleteMutation = useMutation<void, unknown, { postId: number }>({
    mutationFn: (postId) => deletePost(Number(postId)),
  });

  const updateMutation = useMutation<void, unknown, { postId: number }>({
    mutationFn: (postId) => updatePost(Number(postId)),
  });

  if (isLoading) return <h3>Loading...</h3>;

  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate({ postId: post.id })}>
        Delete
      </button>
      {deleteMutation.isError && (
        <p style={{ color: 'red' }}>Error deleting the post</p>
      )}
      {deleteMutation.isLoading && (
        <p style={{ color: 'purple' }}>Deleting the Post...</p>
      )}
      {deleteMutation.isSuccess && (
        <p style={{ color: 'green' }}>Post has (not) been deleted</p>
      )}
      <button onClick={() => updateMutation.mutate({ postId: post.id })}>
        Update title
      </button>
      {updateMutation.isError && (
        <p style={{ color: 'red' }}>Error Update the post</p>
      )}
      {updateMutation.isLoading && (
        <p style={{ color: 'purple' }}>Updating...</p>
      )}
      {updateMutation.isSuccess && (
        <p style={{ color: 'green' }}>Update Success!</p>
      )}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data?.map((comment: CommentsType) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
