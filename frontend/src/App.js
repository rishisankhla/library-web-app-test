import './App.css';
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import BookList from './components/BookList';
import ReaderList from './components/ReaderList';
//import LoanExpiration from './components/LoanExpiration';
import Notification from './components/Notification';
import BooksTaken from './components/BooksTaken';
import MyReaderList from './components/MyReaderList';
import BookApproval from './components/BookApproval';

import { auth } from './firebase'; 

const App = () => {
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setNotification({ message: 'Login successful', type: 'success' });
        setTimeout(() => setNotification(null), 3000);
      } else {
        setUser(null);
      }
    }, (error) => {
      setNotification({ message: error.message, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (user) => {
    setUser(user);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setNotification({ message: 'Logout successful', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ message: error.message, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="App">
      {notification && <Notification message={notification.message} type={notification.type} />}
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Logout</button>
          {user.email === 'rsank001@gold.ac.uk' ? (
            <>
              <BookList />
              <ReaderList />
              <MyReaderList />
              <BookApproval />
              {/* <LoanExpiration /> */}
            </>
          ) : (
            <>
              <BookList />
              <BooksTaken />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;