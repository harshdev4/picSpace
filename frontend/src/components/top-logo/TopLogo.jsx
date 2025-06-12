import { useRef } from 'react'
import styles from './TopLogo.module.css';

const TopLogo = () => {
  const themeRef = useRef();
  const toggleTheme = () => {
    const theme = themeRef.current;
    document.body.classList.toggle('dark-theme');
    theme.textContent = theme.textContent == 'light_mode' ? "dark_mode" : "light_mode";
  }

  return (
    <div className={styles.topContainer}>
      <img src="/logo-title.png" alt="logo" className={styles.topLogo} />
      <div className={styles.themeContainer}>
        <span ref={themeRef} className={`material-symbols-rounded ${styles.navIcon}`} onClick={toggleTheme}>dark_mode</span>
      </div>
    </div>
  )
}

export default TopLogo
