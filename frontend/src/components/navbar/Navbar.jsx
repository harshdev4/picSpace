import React, { useEffect, useRef, useState } from 'react'
import styles from './Navbar.module.css';
import { Link, useLocation } from 'react-router-dom';
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoIosSearch, IoIosAdd  } from "react-icons/io";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { useQueryClient } from '@tanstack/react-query';

const Navbar = () => {
    const { pathname } = useLocation();
    const [activeLink, setActiveLink] = useState('/');
    const themeRef = useRef();

    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(['user']);

    const toggleTheme = () =>{
        const theme = themeRef.current;
        document.body.classList.toggle('dark-theme');
        theme.textContent = theme.textContent == 'light_mode' ? "dark_mode" : "light_mode";
    }

    useEffect(()=>{ 
        setActiveLink(pathname);
    }, [pathname]);
    return (
        <div className={styles.navbarContainer}>
            <img src="/logo-title.png" alt="logo" className={styles.logo} />
            <div className={styles.linkContainer}>
                <Link to='/' className={styles.linkWrapper}><div className={styles.links} onClick={()=> setActiveLink('/')}>{activeLink == '/' ? <GoHomeFill className={styles.navIcon}/> : <GoHome className={`${styles.navIcon} ${styles.notActive}`}/>}<span className={`${styles.navTitle} ${activeLink == '/' ? styles.active: styles.notActive}`}>Home</span></div></Link>
                <Link to='/search' className={styles.linkWrapper}><div className={styles.links} onClick={()=> setActiveLink('/search')}>{activeLink == '/search' ? <IoIosSearch className={styles.navIcon}/> : <IoIosSearch className={`${styles.navIcon} ${styles.notActive}`}/>}<span className={`${styles.navTitle}  ${activeLink == '/search' ? styles.active: styles.notActive}`}>Search</span></div></Link>
                <Link to='/create-post' className={styles.linkWrapper}><div className={styles.links} onClick={()=> setActiveLink('/create-post')}>{activeLink == '/create-post' ? <IoIosAdd className={styles.navIcon}/> : <IoIosAdd className={`${styles.navIcon} ${styles.notActive}`}/>}<span className={`${styles.navTitle}  ${activeLink == '/create-post' ? styles.active: styles.notActive}`}>Create</span></div></Link>
                {
                   user.profilePic ? <Link to={`/profile/${user?.username}`} className={styles.linkWrapper}><div className={styles.links} onClick={()=> setActiveLink('/profile')}> <img src={user.profilePic} className={`${styles.profilePic} ${activeLink.includes('/profile') && styles.profileBorder}`}/> <span className={`${styles.navTitle}  ${activeLink.includes('/profile') ? styles.active: styles.notActive}`}>Profile</span></div></Link> :
                   <Link to={`/profile/${user?.username}`} className={styles.linkWrapper}><div className={styles.links} onClick={()=> setActiveLink('/profile')}>{activeLink.includes('/profile') ? <HiOutlineUserCircle className={styles.navIcon}/> : <HiOutlineUserCircle className={`${styles.navIcon} ${styles.notActive}`}/>}<span className={`${styles.navTitle}  ${activeLink.includes('/profile') ? styles.active: styles.notActive}`}>Profile</span></div></Link>
                }
            </div>
            <div className={styles.themeContainer}>
                <span ref={themeRef} className={`material-symbols-rounded ${styles.navIcon}`} onClick={toggleTheme}>dark_mode</span>
            </div>
        </div>
    )
}
export default Navbar