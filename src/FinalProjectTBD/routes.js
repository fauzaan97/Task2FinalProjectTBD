const { Router } = require('express');
const controller = require('./controller');

const router = Router();

//GET route
router.get('/genre/', controller.getGenre);
router.get('/genre/:id', controller.getGenreById);
router.get('/books/', controller.getBooks);
router.get('/branch/', controller.getBranch);
router.get('/staff/', controller.getStaff);


//POST route
router.post('/genre/', controller.addGenre);
router.post('/branch/', controller.addBranch);
router.post('/staff/', controller.addStaff);
router.post('/books/', controller.addBook);
router.post('/book-query/', controller.buildQuery);

//DELETE route
router.delete('/genre/:id', controller.deleteGenre);

//PUT route
router.put('/genre/:id', controller.updateGenre);

module.exports = router;