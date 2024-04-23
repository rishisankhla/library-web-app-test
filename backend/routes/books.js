const express = require('express');
const router = express.Router();
const admin = require('../firebaseAdmin'); // Use the Firebase Admin SDK from firebaseAdmin.js

// Get all books
router.get('/', async (req, res) => {
  try {
    const snapshot = await admin.database().ref('books').once('value');
    const books = snapshot.val();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
});

router.post('/request', async (req, res) => {
  try {
    const { bookId, userEmail } = req.body;
    const booksRef = admin.database().ref('books');
    const readersRef = admin.database().ref('readers');
    const requestedBooksRef = admin.database().ref('requested-book');
    
    console.log('Request Data:', { bookId, userEmail }); // Log request data

    // Set book status to not-available
    await booksRef.child(bookId).update({
      status: 'not-available'
    });

    let username = '';
    const snapshot = await readersRef.once('value');

    // Convert snapshot to JSON
    const readersData = snapshot.val();
    console.log("Readers Data:", JSON.stringify(readersData, null, 2));  // Logging the data for debugging

    snapshot.forEach(childSnapshot => {
      const reader = childSnapshot.val();
      if (reader.email === userEmail) {
        username = reader.name;
      }
    });

    console.log("Retrieved Username:", username);

    if (!username) {
      throw new Error('Username not found for the given email');
    }


    // Add request to requested-books
    const snapshot2 = await requestedBooksRef.once('value');
    const numRequests = snapshot2.numChildren();
    const newRequestKey = `request${numRequests + 1}`;

    await requestedBooksRef.child(newRequestKey).set({
      'book-requested': bookId,
      email: userEmail,
      'request-status': 'pending',
      username
    });

    res.status(200).json({ message: 'Book requested successfully' });
  } catch (error) {
    console.error('Error:', error.message); // Log the error message
    res.status(500).json({ message: 'Error requesting book', error: error.message });
  }
});

// POST method to handle returning books
router.post('/return/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;

    // Set book status to available
    const booksRef = admin.database().ref('books');
    await booksRef.child(bookId).update({
      status: 'available'
    });

    res.status(200).json({ message: 'Book returned successfully' });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// POST method to handle book returns
router.post('/return', async (req, res) => {
  try {
    const { bookId, userEmail } = req.body;

    // Update book status to available
    const booksRef = admin.database().ref('books');
    await booksRef.child(bookId).update({
      status: 'available'
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
    const updatedBooksTaken = reader.booksTaken.filter(book => book !== bookId);

    await readerRef.update({
      booksTaken: updatedBooksTaken
    });

    res.status(200).json({ message: 'Book returned successfully' });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.post('/returnBook', async (req, res) => {
  console.log("it is working properly");
  try {
    const { userEmail, bookId } = req.body;
    console.log(userEmail, bookId);
    const readersRef = admin.database().ref('readers');
    const booksRef = admin.database().ref('books');  // Add this line to get reference to books

    // Fetch the specific reader using email
    const snapshot = await readersRef.once('value');
    const allReaders = snapshot.val();

    // Find the reader with the matching email
    const readerId = Object.keys(allReaders).find(key => allReaders[key].email === userEmail);
    console.log(readerId);
    if (!readerId) {
      return res.status(404).json({ message: 'Reader not found' });
    }

    const readerRef = admin.database().ref(`readers/${readerId}`);
    const readerSnapshot = await readerRef.once('value');
    const reader = readerSnapshot.val();

    // Remove the returned book from the booksTaken array
    const updatedBooksTaken = reader.booksTaken.filter(book => book !== bookId);

    await readerRef.update({
      booksTaken: updatedBooksTaken
    });

    // Set the book status to "available"
    await booksRef.child(bookId).update({
      status: 'available'
    });

    res.status(200).json({ message: 'BooksTaken array updated and book status set to available successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating BooksTaken array and book status', error });
  }
});


module.exports = router;
