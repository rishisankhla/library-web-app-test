const express = require('express');
const router = express.Router();
const admin = require('../firebaseAdmin');

// Assign a book to a reader
router.post('/assign', async (req, res) => {
  const { bookId, readerId } = req.body;
  const borrowDate = new Date().toISOString();
  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + 30); // 30 days loan period
  
  try {
    await admin.database().ref(`loans/${bookId}`).set({
      bookId,
      readerId,
      borrowDate,
      returnDate: returnDate.toISOString()
    });

    // Update reader's booksTaken
    const snapshot = await admin.database().ref(`readers/${readerId}/booksTaken`).once('value');
    let booksTaken = snapshot.val() || [];
    booksTaken.push(bookId);
    await admin.database().ref(`readers/${readerId}/booksTaken`).set(booksTaken);

    res.json({ returnDate });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning book', error });
  }
});

// Request a book
router.post('/request', async (req, res) => {
  const { bookId, readerId } = req.body;
  
  try {
    const snapshot = await admin.database().ref(`books/${bookId}`).once('value');
    const book = snapshot.val();
    
    if (book && book.status === 'available') {
      await admin.database().ref(`books/${bookId}/status`).set('requested');
      await admin.database().ref(`readers/${readerId}/requests`).push(bookId);
      res.json({ message: 'Book requested successfully' });
    } else {
      res.status(400).json({ message: 'Book is not available for request' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error requesting book', error });
  }
});

// Check loan expiration
router.get('/check-expiration', async (req, res) => {
  const currentDate = new Date().toISOString();
  
  try {
    const snapshot = await admin.database().ref('loans').once('value');
    const loans = snapshot.val();
    
    for (const loanId in loans) {
      if (loans.hasOwnProperty(loanId)) {
        const loan = loans[loanId];
        if (loan.returnDate < currentDate) {
          // Handle expired loan
          console.log(`Loan for book ${loan.bookId} by reader ${loan.readerId} has expired.`);
        }
      }
    }
    
    res.json({ message: 'Loan expiration checked' });
  } catch (error) {
    res.status(500).json({ message: 'Error checking loan expiration', error });
  }
});

// Get loan details by bookId and readerId
router.get('/details', async (req, res) => {
  const { bookId, readerId } = req.query;

  try {
    const snapshot = await admin.database().ref(`loans/${bookId}`).once('value');
    const loan = snapshot.val();
    
    if (loan && loan.readerId === readerId) {
      res.json(loan);
    } else {
      res.status(400).json({ message: 'Loan details not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loan details', error });
  }
});

module.exports = router;
