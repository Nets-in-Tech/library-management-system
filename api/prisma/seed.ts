import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Genres (at least 4 genres required)
  const genresData = [
    {
      name: 'Fiction',
      description: 'Literary works created from the imagination, including novels and short stories.',
    },
    {
      name: 'Science Fiction',
      description: 'Speculative fiction exploring futuristic concepts, space exploration, and advanced science.',
    },
    {
      name: 'Mystery & Thriller',
      description: 'Suspenseful stories involving crimes, investigations, and high-stakes puzzles.',
    },
    {
      name: 'Non-Fiction',
      description: 'Factual accounts covering history, biography, philosophy, and human sciences.',
    },
    {
      name: 'Technology & Computing',
      description: 'Books focused on software engineering, architecture, computer science, and programming practices.',
    },
  ];

  const genres: Record<string, { id: number; name: string }> = {};

  for (const genreData of genresData) {
    const genre = await prisma.genre.upsert({
      where: { name: genreData.name },
      update: { description: genreData.description },
      create: genreData,
    });
    genres[genre.name] = genre;
    console.log(`  ✓ Genre ready: ${genre.name}`);
  }

  // 2. Seed Users with Role Enum (LIBRARIAN and PATRON)
  const usersData = [
    {
      email: 'librarian@library.org',
      name: 'Eleanor Vance',
      role: Role.LIBRARIAN,
    },
    {
      email: 'alex.patron@example.com',
      name: 'Alex Mercer',
      role: Role.PATRON,
    },
    {
      email: 'sarah.reader@example.com',
      name: 'Sarah Connor',
      role: Role.PATRON,
    },
    {
      email: 'marcus.bookworm@example.com',
      name: 'Marcus Holloway',
      role: Role.PATRON,
    },
  ];

  const users: Record<string, { id: number; email: string }> = {};

  for (const userData of usersData) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: { name: userData.name, role: userData.role },
      create: userData,
    });
    users[user.email] = user;
    console.log(`  ✓ User ready: ${user.name} (${userData.role})`);
  }

  // 3. Seed Books (at least 15 books required across the genres)
  const booksData = [
    // Fiction
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0061120084',
      publishedYear: 1960,
      genreName: 'Fiction',
    },
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0743273565',
      publishedYear: 1925,
      genreName: 'Fiction',
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      isbn: '978-0141439518',
      publishedYear: 1813,
      genreName: 'Fiction',
    },
    {
      title: 'One Hundred Years of Solitude',
      author: 'Gabriel García Márquez',
      isbn: '978-0060883287',
      publishedYear: 1967,
      genreName: 'Fiction',
    },

    // Science Fiction
    {
      title: 'Dune',
      author: 'Frank Herbert',
      isbn: '978-0441172719',
      publishedYear: 1965,
      genreName: 'Science Fiction',
    },
    {
      title: 'Neuromancer',
      author: 'William Gibson',
      isbn: '978-0441569595',
      publishedYear: 1984,
      genreName: 'Science Fiction',
    },
    {
      title: 'Foundation',
      author: 'Isaac Asimov',
      isbn: '978-0553293357',
      publishedYear: 1951,
      genreName: 'Science Fiction',
    },
    {
      title: 'The Hitchhiker\'s Guide to the Galaxy',
      author: 'Douglas Adams',
      isbn: '978-0345391803',
      publishedYear: 1979,
      genreName: 'Science Fiction',
    },

    // Mystery & Thriller
    {
      title: 'The Da Vinci Code',
      author: 'Dan Brown',
      isbn: '978-0307474278',
      publishedYear: 2003,
      genreName: 'Mystery & Thriller',
    },
    {
      title: 'Gone Girl',
      author: 'Gillian Flynn',
      isbn: '978-0307588371',
      publishedYear: 2012,
      genreName: 'Mystery & Thriller',
    },
    {
      title: 'The Girl with the Dragon Tattoo',
      author: 'Stieg Larsson',
      isbn: '978-0307949486',
      publishedYear: 2005,
      genreName: 'Mystery & Thriller',
    },
    {
      title: 'And Then There Were None',
      author: 'Agatha Christie',
      isbn: '978-0062073488',
      publishedYear: 1939,
      genreName: 'Mystery & Thriller',
    },

    // Non-Fiction
    {
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      isbn: '978-0062316097',
      publishedYear: 2014,
      genreName: 'Non-Fiction',
    },
    {
      title: 'Educated',
      author: 'Tara Westover',
      isbn: '978-0399590504',
      publishedYear: 2018,
      genreName: 'Non-Fiction',
    },
    {
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      isbn: '978-0374533557',
      publishedYear: 2011,
      genreName: 'Non-Fiction',
    },
    {
      title: 'Steve Jobs',
      author: 'Walter Isaacson',
      isbn: '978-1451648539',
      publishedYear: 2011,
      genreName: 'Non-Fiction',
    },

    // Technology & Computing
    {
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      isbn: '978-0132350884',
      publishedYear: 2008,
      genreName: 'Technology & Computing',
    },
    {
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      isbn: '978-1449373320',
      publishedYear: 2017,
      genreName: 'Technology & Computing',
    },
    {
      title: 'The Pragmatic Programmer: Your Journey to Mastery',
      author: 'David Thomas, Andrew Hunt',
      isbn: '978-0135957059',
      publishedYear: 2019,
      genreName: 'Technology & Computing',
    },
    {
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
      isbn: '978-0201633610',
      publishedYear: 1994,
      genreName: 'Technology & Computing',
    },
  ];

  const seededBooks: { id: number; title: string; isbn: string | null }[] = [];

  for (const book of booksData) {
    const genre = genres[book.genreName];
    if (!genre) {
      throw new Error(`Genre not found for: ${book.genreName}`);
    }

    const createdBook = await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {
        title: book.title,
        author: book.author,
        publishedYear: book.publishedYear,
        genreId: genre.id,
      },
      create: {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publishedYear: book.publishedYear,
        genreId: genre.id,
      },
    });

    seededBooks.push(createdBook);
    console.log(`  ✓ Book ready: "${createdBook.title}" [${book.genreName}]`);
  }

  // 4. Seed Reviews (Stretch Task)
  console.log('⭐ Seeding Reviews (Stretch Task)...');
  const reviewsData = [
    {
      bookIsbn: '978-0441172719', // Dune
      userEmail: 'alex.patron@example.com',
      rating: 5,
      comment: 'An absolute masterpiece of world-building and sci-fi politics. Must read!',
    },
    {
      bookIsbn: '978-1449373320', // Designing Data-Intensive Applications
      userEmail: 'marcus.bookworm@example.com',
      rating: 5,
      comment: 'Essential reading for any backend engineer working with distributed systems.',
    },
    {
      bookIsbn: '978-0062316097', // Sapiens
      userEmail: 'sarah.reader@example.com',
      rating: 4,
      comment: 'Fascinating journey through the history and cognitive revolution of human beings.',
    },
    {
      bookIsbn: '978-0132350884', // Clean Code
      userEmail: 'alex.patron@example.com',
      rating: 4,
      comment: 'Great principles for writing readable and maintainable software.',
    },
  ];

  for (const rev of reviewsData) {
    const book = seededBooks.find((b) => b.isbn === rev.bookIsbn);
    const user = users[rev.userEmail];

    if (book && user) {
      // Avoid duplicate reviews in seed
      const existing = await prisma.review.findFirst({
        where: {
          bookId: book.id,
          userId: user.id,
        },
      });

      if (!existing) {
        await prisma.review.create({
          data: {
            rating: rev.rating,
            comment: rev.comment,
            bookId: book.id,
            userId: user.id,
          },
        });
        console.log(`  ✓ Review created for "${book.title}" by ${user.email}`);
      }
    }
  }

  console.log(`\n🎉 Seed finished successfully!`);
  console.log(`   - Genres created: ${Object.keys(genres).length}`);
  console.log(`   - Books created: ${seededBooks.length}`);
  console.log(`   - Users created: ${Object.keys(users).length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
