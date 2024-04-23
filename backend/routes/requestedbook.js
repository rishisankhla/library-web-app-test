// requestedbook.js
const express = require('express');
const router = express.Router();
const admin = require('../firebaseAdmin'); 

// Get all requested books
router.get('/', async (req, res) => {
  try {
    const snapshot = await admin.database().ref('requested-book').once('value');
    const requestedBooks = snapshot.val();
    res.json(requestedBooks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requested books', error });
  }
});

// Update request
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    await admin.database().ref(`requested-book/${id}`).update(updates);
    res.json({ message: 'Request updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating request', error });
  }
});

// Add this to your backend API routes

// POST method to handle approval of book requests
router.post('/approveRequest', async (req, res) => {
    try {
      const { requestId, bookId, userEmail } = req.body;
  
      // Update request status to approved
      const requestRef = admin.database().ref(`requested-book/${requestId}`);
      await requestRef.update({
        'request-status': 'approved'
      });
  
      // Fetch the specific reader using email
      const snapshot = await admin.database().ref('readers').once('value');
      const allReaders = snapshot.val();
  
      // Find the reader with the matching email
      const readerId = Object.keys(allReaders).find(key => allReaders[key].email === userEmail);
  
      if (!readerId) {
        return res.status(404).json({ message: 'Reader not found' });
      }
  
      const readerRef = admin.database().ref(`readers/${readerId}`);
      const readerSnapshot = await readerRef.once('value');
      const reader = readerSnapshot.val();
  
      // Update the booksTaken array for the reader
      const updatedBooksTaken = [...reader.booksTaken, bookId];
      
      await readerRef.update({
        booksTaken: updatedBooksTaken
      });
  
      res.status(200).json({ message: 'Request approved successfully' });
    } catch (error) {
      console.error('Error approving request:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });
  

module.exports = router;