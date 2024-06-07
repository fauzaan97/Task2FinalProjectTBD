const pool = require('../../db');
const queries = require('./queries');

//get genre
const getGenre = (req, res) => {
    pool.connect((err, client, done) => {
        if (err) throw err;

        client.query('BEGIN', (err) => {
            if (err) {
                done();
                throw err;
            }

            client.query(queries.getGenre, (err, results) => {
                if (err) {
                    client.query('ROLLBACK', (err) => {
                        if (err) {
                            done();
                        }
                    });
                    throw err;
                }

                client.query('COMMIT', (err) => {
                    done();
                    if (err) {
                        throw err;
                    }
                    res.status(200).json(results.rows);
                });
            });
        });
    });
};

//get genre by id
const getGenreById = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(queries.getGenreById, [id], (error, results) => {
        if (error) {
            throw error;
        }
        else{
            res.status(200).json(results.rows);
        }
    });
};

//add genre
const addGenre = (req, res) => {
    const { genreName } = req.body;

    pool.query(queries.checkGenreExist, [genreName], (error, results) => {
        if (results.rows.length) {
            res.send("Genre already exist");
        }
        else{
            //add genre to db
            pool.query(queries.addGenre, [genreName], (error, results) => {
                if (error) {
                    throw error;
                }
                else{
                    res.status(201).send(`Genre added successfully`);
                }
            });
        }
    });
}

//delete genre
const deleteGenre = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(queries.getGenreById, [id], (error, results) => {
        const noGenre = !results.rows.length;
        if (noGenre) {
            res.send("Genre not found");
        }
        else{
            pool.query(queries.deleteGenre, [id], (error, results) => {
                if (error) {
                    throw error;
                }
                else{
                    res.status(200).send(`Genre deleted with ID: ${id}`);
                }
            });
        }
    });
};

//add branch
const updateGenre = (req, res) => {
    const id = parseInt(req.params.id);
    const { genreName } = req.body;

    pool.query(queries.getGenreById, [id], (error, results) => {
        const noGenre = !results.rows.length;
        if (noGenre) {
            res.send("Genre not found");
        }
        else{
            pool.query(queries.updateGenre, [genreName, id], (error, results) => {
                if (error) {
                    throw error;
                }
                else{
                    res.status(200).send(`Genre updated with ID: ${id}`);
                }
            });
        } 
    });
};

//add branch
const addBranch = (req, res) => {
    const { location } = req.body;

    pool.query(queries.checkBranchExist, [location], (error, results) => {
        if (results.rows.length) {
            res.send("Branch already exist");
        }
        else {
            //add branch to db
            pool.query(queries.addBranch, [location], (error, results) => {
                if (error) {
                    throw error;
                }
                res.status(201).send(`Branch added successfully`);
            });
        }
    });
};

//add staff
const addStaff = (req, res) => {
    const { 
        staffName, 
        salary, 
        position, 
        branchID 
    } = req.body;

    pool.query(queries.checkStaffExist,[staffName], (error, results) => {
        if (results.rows.length) {
            res.send("Staff already exist");
        }
        else {
            //add staff to db
            pool.query(queries.addStaff, [staffName, salary, position, branchID], (error, results) => {
                if (error) {
                    throw error;
                }
                res.status(201).send('Staff added successfully');
            });
        }
    });
};

//add book
const addBook = (req, res) => {
    const {
        bookName,
        publicationYear,
        pages,
        bookPrice,
        publisherName,
        languageID,
        genreID
    } = req.body;

    pool.query(queries.checkBookExist, [bookName], (error, results) => {
        if (results.rows.length) {
            res.send("Book already exist");
        }
        else {
            //add book to db
            pool.query(queries.addBook, [
                bookName, 
                publicationYear, 
                pages, bookPrice, 
                publisherName, languageID, 
                genreID
            ], (error, results) => {
                if (error) {
                    throw error;
                }
                res.status(201).send('Book added successfully');
            });
        }
    });
};

//get book
const getBooks = (req, res) => {
    pool.query(queries.getBooks, (error, results) => {
        if (error) {
            throw error;
        }
        else{
            res.status(200).json(results.rows);
        }
    });
};

module.exports = {
    getGenre,
    getGenreById,
    addGenre,
    deleteGenre,
    updateGenre,
    addBranch,
    addStaff,
    addBook,
    getBooks,
};