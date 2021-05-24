const {
  addBookHandler,
  readBooksHandler,
  readBookByidHandler,
  editBookByIdHandler,
  deleteBookByIdhandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: readBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: readBookByidHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdhandler,
  },
];

module.exports = routes;
