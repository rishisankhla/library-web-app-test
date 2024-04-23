import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { getDatabase, ref, child, set, get } from "firebase/database";

const Login = ({ onLogin, onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      onLogin(user);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Create user in database
      await createUserInDatabase(user);
  
      onSignup(user);
    } catch (error) {
      setError(error.message);
    }
  };
  
  const createUserInDatabase = async (user) => {
    const { uid } = user;
    const db = getDatabase();
    const readersRef = ref(db, 'readers');
  
    if (email !== 'rsank001@gold.ac.uk') {  // Check if not admin email
      try {
        const snapshot = await get(ref(db, 'readers'));
        const readers = snapshot.val();
        const numReaders = Object.keys(readers).length; // Count the number of keys in the readers object
        const newReaderKey = `reader${numReaders + 1}`; // Generate a unique key for the new reader
        const newReaderData = {
          email,
          name,
          booksTaken: ["no-book-new-user"]  // Add the initial book to booksTaken array
        };
  
        await set(child(readersRef, newReaderKey), newReaderData);
  
        console.log('User added successfully!');
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }
  };
  
  
  

  return (
    <div className="container mx-auto">
      <form onSubmit={handleLoginSubmit} className="mt-4">
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Login</button>
      </form>
      <div className="mt-4">
        <p>Don't have an account? <button onClick={handleSignupSubmit} className="text-blue-500">Sign Up</button></p>
      </div>
    </div>
  );
};

export default Login;
