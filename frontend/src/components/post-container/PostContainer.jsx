import styles from './PostContainer.module.css';
import Post from '../post/Post'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance.js';
import { useContext, useEffect, useRef, useState } from 'react';
import Loader from '../loader/Loader.jsx';
import { GiEmptyHourglass } from "react-icons/gi";
import { TbLoader } from "react-icons/tb";
import { ScrollContext } from '../../context/feedScrollContext.jsx';
import AllUser from '../all-user/AllUser.jsx';

const PostContainer = () => {
  const container = useRef(null);
  const {scrollPosition} = useContext(ScrollContext);
  const [isScrolled, setIsScroll] = useState(false);

  const queryClient = useQueryClient();

  const currentUser = queryClient.getQueryData(['user']);

  const fetchPost = async ({ pageParam }) => {
    try {
      const res = await axiosInstance.get(`/post/getPosts?page=${pageParam}`);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Something went wrong");
    }
  }

    const handleScroll = () => {
      const ct = container.current;
      if (ct) {
        scrollPosition.current = ct.scrollTop;
        if (ct.clientHeight + ct.scrollTop >= ct.scrollHeight - 1 && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
  }

  const { data, isLoading, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['Posts'],
    queryFn: fetchPost,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
  });

  useEffect(() => {
    const ct = container.current;
    if (ct) {
      ct.scrollTop = scrollPosition.current;
      setIsScroll(true);
      ct.addEventListener('scroll', handleScroll);
      return () => {
        ct.removeEventListener('scroll', handleScroll);
      }
    }
  }, [])

  return (
    <div ref={container} className={styles.postMainContainer}>
      <AllUser/>
      {isLoading && <Loader />}

      {data?.pages?.map((page, index) => (
        <div className={styles.postContainer} style={{visibility: isScrolled ? 'visible' : 'hidden'}} key={index}>
          {page.posts.length > 0 ? page?.posts?.map(post => <Post key={post._id} postId={post._id} user={post.user} caption={post.caption} image={post.image} owner={post.user} isLiked={post.likes.includes(currentUser.id)} like={post.likes.length} />)
            :
            <div className={styles.emptyContainer}>
              <GiEmptyHourglass className={styles.emptyIcon} />
              <span className={styles.emptyFeedText}>Your feed is empty</span>
            </div>
          }
          {isFetchingNextPage && <TbLoader className={styles.pageLoadIcon} />}
        </div>
      ))}

    </div>
  )
}

export default PostContainer
