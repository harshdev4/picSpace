import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/Navbar';
import TopLogo from './components/top-logo/TopLogo';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from './api/axiosInstance.js';
import { useState } from 'react';
 
function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  
  const isLoggedIn = async () => {
    try {
      const res = await axiosInstance.get('/user/isLoggedIn');
      return res.data.user;
    } catch (error) {
      if (error.response?.status === 401) {
        setIsLoggedOut(true);
        return null;
      }
      toast.error("Something went wrong");
      throw error;
    }
  }

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: isLoggedIn,
    staleTime: 0,
    refetchInterval: 30000, // 30s
    retry: false,
    enabled: !isLoggedOut
  });


  useEffect(() => {
    document.title = "BeSocial"
    if (!isLoading) {

      if (user) {
        setIsLoggedOut(false);
      }

      if (!user && (pathname !== '/signup' && pathname !== '/login')) {
        if (!pathname.includes('/post/')) {
          navigate('/login');
        }
      }

      if (user && (pathname === '/login' || pathname === '/signup')) {
        navigate('/');
      }
      
    }
  }, [pathname, user, isLoading]);

  return (
    <>
      <Toaster />{
        !isLoading && <>
          {user && <TopLogo></TopLogo>}
          {user && <Navbar />}
          <div className={`mainContainer ${!user && 'authPadding'}`}>
            <Outlet>
            </Outlet>
          </div>
        </>}
    </>
  )
}

export default App
