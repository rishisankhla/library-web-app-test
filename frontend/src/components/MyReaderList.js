import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReadersTable = () => {
  const [readers, setReaders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/readers');
        const data = response.data;
        const formattedReaders = Object.values(data).map((reader) => ({
          name: reader.name,
          email: reader.email,
          booksTaken: reader.booksTaken.join(', '),
        }));
        setReaders(formattedReaders);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold mb-4">Books Taken</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Books Taken</th>
          </tr>
        </thead>
        <tbody>
          {readers.map((reader, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{reader.name}</td>
              <td className="border border-gray-300 px-4 py-2">{reader.email}</td>
              <td className="border border-gray-300 px-4 py-2">{reader.booksTaken}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReadersTable;
