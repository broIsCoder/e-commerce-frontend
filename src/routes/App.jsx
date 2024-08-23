import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Alerts from '../components/Alerts'
import { useSelector, useDispatch } from 'react-redux'
import { setUserInfo } from '../redux-slices/userInfoSlice'
import { addAlert } from '../redux-slices/alertsSlice'
import { verifyToken } from '../redux-slices/authSlice'
import LoadingPage from '../LoadingPage'

const App = () => {
  let firsttime = true;
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  const authToken = useSelector((state) => state.auth.authToken);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        setLoading(true)
        const response = await dispatch(verifyToken('/user'))

        // catch server error
        if (!response.ok && response.status === 500) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success) {
          dispatch(setUserInfo({ user: data.user }));
          dispatch(addAlert({ message: data.message, type: 'success' }));
        } else {
          dispatch(addAlert({ message: data.message, type: 'warning' }));
        }
      } catch (error) {
        dispatch(addAlert({ message: error.message, type: 'error' }));
        setError(error.message)
      } finally {
        setLoading(false);
      }
    };

    if (firsttime) {
      if (!authToken || !isLoggedIn) {
        dispatch(addAlert({ message: "You are logged out", type: "warning" }));
      } else {
        fetchUserSession();
      }
      firsttime = false;
    }
  }, [isLoggedIn]);

  if (loading) {
    return <LoadingPage msg='Getting Your Session' />
  }

  if (error) {
    throw new Error(error)
  }
  return (
    <div className='h-dvh'>
      <Alerts />
      <Outlet />
    </div>
  )
}

export default App
