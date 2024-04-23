const admin = require('./firebaseAdmin');

// Dummy Data
const books = {
  book1: {
    author: "Harper Lee",
    isbn: "9780061120084",
    status: "available",
    title: "To Kill a Mockingbird"
  },
  book2: {
    author: "George Orwell",
    isbn: "9780451524935",
    status: "available",
    title: "1984"
  },
  book3: {
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    status: "available",
    title: "The Great Gatsby"
  },
  book4: {
    author: "Scotzgerald",
    isbn: "9780555573565",
    status: "not-available",
    title: "The best family"
  },
  book5: {
    author: "J.K. Rowling",
    isbn: "9780747551003",
    status: "available",
    title: "Harry Potter and the Sorcerer's Stone"
  },
  book6: {
    author: "J.R.R. Tolkien",
    isbn: "9780261102385",
    status: "not-available",
    title: "The Hobbit"
  },
  book7: {
    author: "Agatha Christie",
    isbn: "9780007119318",
    status: "available",
    title: "Murder on the Orient Express"
  },
  book8: {
    author: "Markus Zusak",
    isbn: "9780375842207",
    status: "available",
    title: "The Book Thief"
  },
  book9: {
    author: "Jane Austen",
    isbn: "9780141439518",
    status: "available",
    title: "Pride and Prejudice"
  },
  book10: {
    author: "Ernest Hemingway",
    isbn: "9780684803357",
    status: "available",
    title: "The Old Man and the Sea"
  },
  book11: {
    author: "F. Scott Fitzgerald",
    isbn: "9780684801520",
    status: "available",
    title: "The Beautiful and Damned"
  },
  book12: {
    author: "Kazuo Ishiguro",
    isbn: "9780571258093",
    status: "available",
    title: "Never Let Me Go"
  },
  book13: {
    author: "Roald Dahl",
    isbn: "9780142410370",
    status: "available",
    title: "Matilda"
  },
  book14: {
    author: "Leo Tolstoy",
    isbn: "9780679600841",
    status: "not-available",
    title: "War and Peace"
  },
  book15: {
    author: "Charlotte Bronte",
    isbn: "9780141441146",
    status: "not-available",
    title: "Jane Eyre"
  }
};

const readers = {
  reader1: {
    email: "rsank002@gold.ac.uk",
    name: "John Doe",
    booksTaken: ["book14", "book4"]
  },
  reader2: {
    email: "rsank003@gold.ac.uk",
    name: "Jane Doe",
    booksTaken: ["book15", "book6"]
  }
};

const loans = {
  loan1: {
    bookId: "book1",
    borrowDate: "2024-04-18",
    readerId: "John Doe",
    returnDate: "2024-05-18"
  },
  loan2: {
    bookId: "book2",
    borrowDate: "2024-04-18",
    readerId: "Jane Doe",
    returnDate: "2024-05-18"
  }
};

const requestedBooks = {
  request1: {
    username: "John Doe",
    email: "rsank002@gold.ac.uk",
    "book-requested": "book4",
    "request-status": "approved"
  },
  request2: {
    username: "Jane Doe",
    email: "rsank003@gold.ac.uk",
    "book-requested": "book3",
    "request-status": "pending"
  }
};

// Function to add dummy data
const addDummyData = async () => {
  try {
    await admin.database().ref('books').set(books);
    await admin.database().ref('readers').set(readers);
    await admin.database().ref('loans').set(loans);
    await admin.database().ref('requested-book').set(requestedBooks);
    console.log('Dummy data added successfully!');
  } catch (error) {
    console.error('Error adding dummy data:', error);
  } finally {
    process.exit(); // Exit the script
  }
};

// Call the function to add dummy data
addDummyData();
