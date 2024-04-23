import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LoanExpiration() {
  const [expiredLoans, setExpiredLoans] = useState([]);

  useEffect(() => {
    const checkExpiration = async () => {
      const response = await axios.get('http://localhost:5000/loans/check-expiration');
      setExpiredLoans(response.data);
    };

    checkExpiration();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Loan Expiration</h2>
      {expiredLoans.length > 0 ? (
        <ul>
          {expiredLoans.map((loan) => (
            <li key={loan.id}>{`Loan for book ${loan.bookId} by reader ${loan.readerId} has expired.`}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">No expired loans found.</p>
      )}
    </div>
  );
}

export default LoanExpiration;
