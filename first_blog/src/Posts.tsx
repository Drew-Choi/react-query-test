import React, { useState } from 'react';
import { UseErrorBoundary, useQuery } from '@tanstack/react-query';
import { PostDetail } from './PostDetail';
const maxPostPage = 10;

interface dataTypes {
  userId: number;
  id: number;
  title: string;
  body: string;
}

async function fetchPosts() {
  const response = await fetch(
    'https://jsonplaceholder.typicode.com/posts?_limit=10&_page=0',
  );
  console.log('요청하니?');

  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState<dataTypes | undefined>(
    undefined,
  );

  // replace with useQuery
  // 첫번째는 쿼리key, 두번째는 요청을 보내는 함수
  const {
    data,
    isError,
    isLoading,
    error,
  }: {
    data: dataTypes[] | undefined;
    isError: boolean;
    isLoading: boolean;
    error: Error | null;
  } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  // 로딩 중 일때 (유사 isFetching)
  if (isLoading) return <h3>Loading...</h3>;

  // 에러 발생시
  if (isError)
    return (
      <>
        <h3>Oops, something went wrong!</h3>
        <p>{error?.message}</p>
      </>
    );

  return (
    <>
      <ul>
        {data?.map((post: dataTypes | undefined) => (
          <li
            key={post?.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post?.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled onClick={() => {}}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled onClick={() => {}}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
