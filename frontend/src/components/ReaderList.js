import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ReaderList() {
  const [readers, setReaders] = useState([]);
  const [selectedReader, setSelectedReader] = useState(null);

  useEffect(() => {
    const fetchReaders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/readers');
        if (typeof response.data === 'object' && !Array.isArray(response.data)) {
          // Convert object to array
          const readersArray = Object.values(response.data);
          setReaders(readersArray);
        } else {
          console.error('Received data is not an object:', response.data);
        }
      } catch (error) {
        console.error('Error fetching readers:', error);
      }
    };

    fetchReaders();
  }, []);

  const handleDetailsClick = (reader) => {
    setSelectedReader(reader);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Readers</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {readers.map((reader, index) => (
          <li key={index} className="bg-white rounded-lg overflow-hidden shadow-lg p-4">
            <h3 className="text-xl font-semibold mb-2">{reader.name}</h3>
            <p className="text-gray-600">{reader.email}</p>
            <p className="text-sm text-gray-400 mt-2">Books taken: {reader.booksTaken ? reader.booksTaken.length : 0}</p>
            <button className="bg-blue-500 text-white py-1 px-2 rounded mt-2" onClick={() => handleDetailsClick(reader)}>Details</button>
          </li>
        ))}
      </ul>

      {selectedReader && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">{selectedReader.name}</h3>
            <p>Email: {selectedReader.email}</p>
            <button className="bg-red-500 text-white py-1 px-2 rounded mt-4" onClick={() => setSelectedReader(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReaderList;
