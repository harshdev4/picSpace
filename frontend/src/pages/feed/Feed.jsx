import styles from './Feed.module.css';
import PostContainer from "../../components/post-container/PostContainer"

const Feed = () => {
  return (
    <div className={styles.feedContainer}>
      <PostContainer />
    </div>
  )
}

export default Feed
