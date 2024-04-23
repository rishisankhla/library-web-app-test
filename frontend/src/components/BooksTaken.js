import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';

const BooksTaken = () => {
  const [booksTaken, setBooksTaken] = useState([]);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get user email from Firebase auth
    const user = auth.currentUser;
    if (user) {
      const userEmail = user.email;
      setUserEmail(userEmail);

      // Fetch data from readers API
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:5000/readers');
          const allReaders = response.data;

          console.log("All Readers:", allReaders);  // Debug log to check all readers
          
          // Find the reader by email
          const reader = Object.values(allReaders).find(reader => reader.email === userEmail);
          
          console.log("Found Reader:", reader);  // Debug log to check found reader
  
          if (reader) {
            setBooksTaken(reader.booksTaken || []);
          } else {
            console.error('Reader not found');
            setError('Reader not found');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Error fetching data');
        }
      };

      fetchData();
    } else {
      console.error('No user found');
      setError('User not authenticated');
    }
  }, []);  // Empty dependency array to run the effect only once when the component mounts
  
  const handleReturnBook = async (book) => {
    try {
      // Call the API to update book status to "available"
      await axios.post('http://localhost:5000/books/returnBook', { userEmail, bookId: book });

      // Call the API to update the BooksTaken array for the signed-in reader
      await axios.post('http://localhost:5000/readers/returnBook', { userEmail, bookId: book });

      // Update the booksTaken state after returning the book
      setBooksTaken(prevBooks => prevBooks.filter(b => b !== book));

      // Show popup message
        alert('Book returned successfully');

        // Refresh the page
        window.location.reload();

    } catch (error) {
      console.error('Error returning book:', error);
      setError('Error returning book');
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Books Taken</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Book</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {booksTaken.map((book, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{book}</td>
              <td className="border border-gray-300 px-4 py-2">
                {book !== 'no-book-new-user' && (
                  <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => handleReturnBook(book)}
                  >
                    Return
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BooksTaken;
