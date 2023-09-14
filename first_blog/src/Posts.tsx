import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PostDetail } from './PostDetail';
const maxPostPage = 10;

async function fetchPosts(pageNum: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`,
  );
  console.log('요청하니?');

  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedPost, setSelectedPost] = useState<DataTypes | undefined>(
    undefined,
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(['posts', nextPage], () =>
        fetchPosts(nextPage),
      );
    }
  }, [currentPage, queryClient]);

  // replace with useQuery
  // 첫번째는 쿼리key, 두번째는 요청을 보내는 함수
  const {
    data,
    isError,
    isLoading,
    error,
    isFetching, // isLoading과 isFetching의 차이는 캐싱의 차이 로딩이 캐싱을 감지
  }: {
    data: DataTypes[] | undefined;
    isError: boolean;
    isLoading: boolean;
    error: Error | null;
    isFetching: boolean;
  } = useQuery({
    queryKey: ['posts', currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 2000,
    keepPreviousData: true,
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
        {data?.map((post: DataTypes | undefined) => (
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
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((preValue) => preValue - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((preValue) => preValue + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
