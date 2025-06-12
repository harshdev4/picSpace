import styles from './Feed.module.css';
import PostContainer from "../../components/post-container/PostContainer"
import AllUser from '../../components/all-user/AllUser';

const Feed = () => {
  return (
    <div className={styles.feedContainer}>
      <PostContainer />
    </div>
  )
}

export default Feed
