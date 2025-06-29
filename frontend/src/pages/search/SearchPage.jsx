import { useEffect, useState } from 'react';
import styles from './SearchPage.module.css';
import { Link } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance.js';
import { useQuery } from '@tanstack/react-query'
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { Helmet } from 'react-helmet';
const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const searchUser = async (query) => {
    try {
      const res = await axiosInstance.get(`/user/searchUser?searchQuery=${query}`);
      return res.data.users;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Something went wrong");
    }
  }

  const { data: users } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => searchUser(searchQuery),
    gcTime: 0,
    enabled: !!searchQuery
  })

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.searchContainer}>
      <Helmet>
        <title>Search | PicSpace</title>
      </Helmet>
      <div className={styles.inputContainer}>
        <span className={`material-symbols-rounded ${styles.searchIcon}`}>search</span>
        <input type="text" name="search" value={searchQuery} className={styles.searchBar} placeholder='Search' autocomplete="off" autoFocus={true} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
      <div style={{ display: users && users.length > 0 ? 'block' : 'none' }} className={styles.seachUserContainer}> {users &&
        users.map((user, index) => (
          <div key={index} className={styles.user}>
            <Link to={`/profile/${user.username}`} className={styles.profileLink}>
              {
                user.profilePic ? <img src={user.profilePic} alt="userPic" className={styles.userPic} /> : <HiOutlineUserCircle className={styles.userPicIcon} />
              }
              <div className={styles.names}>
                <h3 className={styles.username}>{user.username}</h3>
                <h3 className={styles.fullname}>{user.fullname}</h3>
              </div>
            </Link>
          </div>
        ))
      }</div>
    </div>
  )
}

export default SearchPage
