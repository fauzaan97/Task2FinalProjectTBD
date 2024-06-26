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

//update genre
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

//add branch TCL
const addBranch = async (req, res) => {
    const { location } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const checkBranchExistResult = await client.query(queries.checkBranchExist, [location]);
        
        if (checkBranchExistResult.rows.length) {
            res.send("Branch already exists");
        } else {
            await client.query(queries.addBranch, [location]);
            await client.query('COMMIT');
            res.status(201).send(`Branch added successfully`);
        }
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};


//get branch
const getBranch = (req, res) => {
    pool.query(queries.getBranch, (error, results) => {
        if (error) {
            throw error;
        }
        else{
            res.status(200).json(results.rows);
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

//get staff
const getStaff = (req, res) => {
    pool.query(queries.getStaff, (error, results) => {
        if (error) {
            throw error;
        }
        else{
            res.status(200).json(results.rows);
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

const buildQuery = (req, res) => {
    const { filters, sort, limit, offset } = req.body;
    // Query base
    let query = 'SELECT * FROM "Book"';
    let queryParams = [];
    let queryConditions = [];
  
    // Filters Query
    if (filters) {
        Object.keys(filters).forEach((key, index) => {
            if (typeof filters[key] === "object") {
            Object.keys(filters[key]).forEach((condition) => {
                let paramIndex = queryParams.length + 1;
                switch (condition) {
                case "gte":
                    queryConditions.push(`"${key}" >= $${paramIndex}`);
                    queryParams.push(filters[key][condition]);
                    break;
                case "lte":
                    queryConditions.push(`"${key}" <= $${paramIndex}`);
                    queryParams.push(filters[key][condition]);
                    break;
                }
            });
        } else {
            let paramIndex = queryParams.length + 1;
            queryConditions.push(`"${key}" = $${paramIndex}`);
            queryParams.push(filters[key]);
            }
        });
    }
  
    // Combine conditions with WHERE clause
    if (queryConditions.length > 0) {
        query += ` WHERE ${queryConditions.join(" AND ")}`;
    }
  
    // Sort Query
    if (sort) {
        query += ` ORDER BY "${sort.column}" ${sort.direction}`;
    }
  
    // Limit Query
    if (limit) {
        queryParams.push(limit);
        query += ` LIMIT $${queryParams.length}`;
    }
  
    // Offset Query
    if (offset) {
      queryParams.push(offset);
      query += ` OFFSET $${queryParams.length}`;
    }
  
    // Execute the Built Query
    pool.query(query, queryParams, (error, results) => {
      if (error) throw error;
      res.status(200).json(results.rows);
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
    getBranch,
    getStaff,
    buildQuery,
};