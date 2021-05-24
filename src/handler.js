const { nanoid } = require('nanoid');
const booksData = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  booksData.push(newBook);

  const isSuccess = booksData.filter((b) => b.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);
  return response;
};

const readBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query;

  if (finished !== undefined) {
    if (finished === '1') {
      const finishedBook = booksData.filter((b) => b.readPage === b.pageCount);

      const response = h.response({
        status: 'success',
        data: {
          books: finishedBook.map((b) => ({
            id: b.id,
            name: b.name,
            publisher: b.publisher,
          })),
        },
      });

      response.code(200);
      return response;
    }

    if (finished === '0') {
      const finishedBook = booksData.filter((b) => b.readPage < b.pageCount);

      const response = h.response({
        status: 'success',
        data: {
          books: finishedBook.map((b) => ({
            id: b.id,
            name: b.name,
            publisher: b.publisher,
          })),
        },
      });

      response.code(200);
      return response;
    }
  }

  if (name !== undefined) {
    const nameBook = booksData.filter((b) => b.name.toLowerCase().search(name.toLowerCase()) >= 0);

    const response = h.response({
      status: 'success',
      data: {
        books: nameBook.map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  if (reading === '1') {
    const readingBook = booksData.filter((b) => b.reading === true);

    const response = h.response({
      status: 'success',
      data: {
        books: readingBook.map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  if (reading === '0') {
    const readingBook = booksData.filter((b) => b.reading === false);

    const response = h.response({
      status: 'success',
      data: {
        books: readingBook.map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    reading,
    data: {
      books: booksData.map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
      })),
    },
  });

  return response;
};

const readBookByidHandler = (request, h) => {
  const { bookId } = request.params;

  const book = booksData.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });

    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const index = booksData.findIndex((b) => b.id === bookId);

  if (index !== -1) {
    const finished = pageCount === readPage;
    booksData[index] = {
      ...booksData[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

const deleteBookByIdhandler = (request, h) => {
  const { bookId } = request.params;

  const index = booksData.findIndex((b) => b.id === bookId);

  if (index !== -1) {
    booksData.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  readBooksHandler,
  readBookByidHandler,
  editBookByIdHandler,
  deleteBookByIdhandler,
};
