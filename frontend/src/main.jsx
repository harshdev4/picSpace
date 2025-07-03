import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Feed from './pages/feed/Feed.jsx'
import SearchPage from './pages/search/SearchPage.jsx'
import Create from './pages/create/Create.jsx'
import Profile from './pages/profile/Profile.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ScrollContextProvider from './context/feedScrollContext.jsx'
import EditProfile from './pages/edit-profile/EditProfile.jsx'
import SinglePost from './components/single-post/SinglePost.jsx'
import Following from './pages/FollowUsersPages/Following.jsx'
import Followers from './pages/FollowUsersPages/Followers.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Register />
      },
      {
        path: '/',
        element: <Feed />
      },
      {
        path: '/search',
        element: <SearchPage />
      },
      {
        path: '/create-post',
        element: <Create />
      },
      {
        path: '/profile/edit',
        element: <EditProfile/>
      },
      {
        path: '/post/:postId',
        element: <SinglePost/>
      },
      {
        path: '/profile/:username',
        element: <Profile />
      },
      {
        path: '/:username/following',
        element: <Following/>
      },
      {
        path: '/:username/followers',
        element: <Followers/>
      }
    ]
  }
]);

const queryClient = new QueryClient;

createRoot(document.getElementById('root')).render(
  <ScrollContextProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}></RouterProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ScrollContextProvider>
)
