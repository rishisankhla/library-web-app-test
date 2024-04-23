const express = require('express');
const router = express.Router();
const admin = require('../firebaseAdmin');

// Get all readers
router.get('/', async (req, res) => {
  try {
    const snapshot = await admin.database().ref('readers').once('value');
    const readers = snapshot.val();
    res.json(readers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching readers', error });
  }
});

// Add a new reader
router.post('/signup', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (email !== 'rsank001@gold.ac.uk') {  // Check if not admin email
      const readersRef = admin.database().ref('readers');
      const snapshot = await readersRef.once('value');
      const numReaders = snapshot.numChildren();
      const newReaderKey = `reader${numReaders + 1}`; // Generate a unique key for the new reader
      
      await readersRef.child(newReaderKey).set({
        email,
        name,
        booksTaken: []  // Ensure booksTaken field is included
      });
      res.status(201).json({ message: 'Reader created successfully' });
    } else {
      res.status(403).json({ message: 'Admin cannot be added' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating reader', error });
  }
});

// Get a specific reader by ID
router.get('/:id', async (req, res) => {
  try {
    const readerId = req.params.id;
    const snapshot = await admin.database().ref(`readers/${readerId}`).once('value');
    const reader = snapshot.val();

    if (reader) {
      res.json(reader);
    } else {
      res.status(404).json({ message: 'Reader not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reader', error });
  }
});

router.get('/:email', async (req, res) => {
  try {
    const email = req.params.email;
    console.log(`Fetching reader with email: ${email}`);
    
    const snapshot = await admin.database().ref('readers').once('value');
    const allReaders = snapshot.val();
    
    console.log('All readers:', allReaders); // Logging the allReaders object to understand its structure
    
    if (!allReaders || typeof allReaders !== 'object') {
      console.error('Invalid readers data:', allReaders);
      return res.status(500).json({ message: 'Invalid readers data' });
    }
    
    // Find the reader with the matching email
    const readerId = Object.keys(allReaders).find(key => allReaders[key].email === email);
    
    if (!readerId) {
      console.log('Reader not found');
      return res.status(404).json({ message: 'Reader not found' });
    }
    
    const reader = allReaders[readerId];
    
    console.log('Found reader:', reader);
    res.json(reader);
    
  } catch (error) {
    console.error('Error fetching reader:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// POST method to handle returning books and update booksTaken array
router.post('/return/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { bookId } = req.body;

    // Fetch the specific reader using email
    const snapshot = await admin.database().ref('readers').once('value');
    const allReaders = snapshot.val();

    // Find the reader with the matching email
    const readerId = Object.keys(allReaders).find(key => allReaders[key].email === email);

    if (!readerId) {
      return res.status(404).json({ message: 'Reader not found' });
    }

    const readerRef = admin.database().ref(`readers/${readerId}`);
    const readerSnapshot = await readerRef.once('value');
    const reader = readerSnapshot.val();

    // Remove the book from the booksTaken array
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

// Add this route to update the booksTaken array for the reader by removing the returned book
router.post('/returnBook', async (req, res) => {
  try {
    const { userEmail, bookId } = req.body;
    const readersRef = admin.database().ref('readers');

    // Fetch the specific reader using email
    const snapshot = await readersRef.once('value');
    const allReaders = snapshot.val();

    // Find the reader with the matching email
    const readerId = Object.keys(allReaders).find(key => allReaders[key].email === userEmail);

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

    res.status(200).json({ message: 'BooksTaken array updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating BooksTaken array', error });
  }
});


module.exports = router;
