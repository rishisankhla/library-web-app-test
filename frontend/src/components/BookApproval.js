import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RequestedBooks = () => {
  const [requestedBooks, setRequestedBooks] = useState([]);
  const [error, setError] = useState(null);
  const [showComponent, setShowComponent] = useState(true); // State to control component rendering

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/requestedbook');
        const data = response.data;

        // Convert the object into an array for easier mapping
        const booksArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setRequestedBooks(booksArray);
      } catch (error) {
        console.error('Error fetching requested books:', error);
        setError('Error fetching requested books');
      }
    };

    fetchData();
  }, [showComponent]); // Trigger fetchData on showComponent change

  const approveRequest = async (requestId, bookId, userEmail) => {
    try {
      // Call the new approveRequest API
      const response = await axios.post(`http://localhost:5000/requestedbook/approveRequest`, {
        requestId,
        bookId,
        userEmail
      });
  
      alert(response.data.message);
      window.location.reload(); // Reload the whole page
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Error approving request');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl mb-4">Requested Books</h2>
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Book Requested
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Email
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Username
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
          </tr>
        </thead>
        <tbody>
          {requestedBooks.map((book, index) => (
            <tr key={index}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {book['book-requested']}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {book.email}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {book['request-status']}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {book.username}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {book['request-status'] === 'pending' && (
                  <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => approveRequest(book.id, book['book-requested'], book.email)}>Approve Request</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestedBooks;
