const getGenre = 'SELECT * FROM genre';
const getGenreById = 'SELECT * FROM genre WHERE "genreID" = $1';
const checkGenreExist = 'SELECT g FROM genre g WHERE "genreName" = $1';
const addGenre = 'INSERT INTO genre ("genreName") VALUES ($1)';
const deleteGenre = 'DELETE FROM genre WHERE "genreID" = $1';
const updateGenre = 'UPDATE genre SET "genreName" = $1 WHERE "genreID" = $2';
const checkBranchExist = 'SELECT b FROM branch b WHERE "location" = $1';
const addBranch = 'INSERT INTO branch ("location") VALUES ($1)';
const checkStaffExist = 'SELECT s FROM "Staff" s WHERE "staffName" = $1';
const addStaff = 'INSERT INTO "Staff" ("staffName","salary","position", "branchID") VALUES ($1, $2, $3, $4)';
const addBook = 'INSERT INTO "Book" ("bookName","publicationYear","pages","bookPrice","publisherName","languageID","genreID") VALUES ($1, $2, $3, $4)';
const getBooks = 'SELECT * FROM "Book"';

module.exports = {
    getGenre,
    getGenreById,
    checkGenreExist,
    addGenre,
    deleteGenre,
    updateGenre,
    checkBranchExist,
    addBranch,
    checkStaffExist,
    addStaff,
    addBook,
    getBooks
};
