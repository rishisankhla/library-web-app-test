import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';

function BookList() {
  const [books, setBooks] = useState([]);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/books');
        if (response.data && typeof response.data === 'object') {
          const booksArray = Object.entries(response.data).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setBooks(booksArray);
        } else {
          console.error('Invalid data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();

    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  const requestBook = async (bookId) => {
    try {
      const response = await axios.post('http://localhost:5000/books/request', {
        bookId,
        userEmail
      });
      if (response.data.message === 'Book requested successfully') {
        alert('Thank you for requesting the book. Admin will approve it soon.');
        // Refresh the book list after request
        window.location.reload();
      }
    } catch (error) {
      console.error('Error requesting book:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Books</h2>
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-2 px-4">Book ID</th>
            <th className="py-2 px-4">Title</th>
            <th className="py-2 px-4">Author</th>
            <th className="py-2 px-4">ISBN</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead> 
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td className="py-2 px-4">{book.id}</td>
              <td className="py-2 px-4">{book.title}</td>
              <td className="py-2 px-4">{book.author}</td>
              <td className="py-2 px-4">{book.isbn}</td>
              <td className="py-2 px-4">{book.status}</td>
              <td className="py-2 px-4">
                {book.status === 'available' && userEmail !== 'rsank001@gold.ac.uk' && (
                  <button className="bg-blue-500 text-white py-1 px-2 rounded mr-2 hover:bg-blue-600" onClick={() => requestBook(book.id)}>Request Book</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookList;
