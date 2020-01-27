const express = require('express');
const logger = require('./logger');
const bookmarksRouter = express.Router();
const bodyParser = express.json();
const uuid = require('uuid/v4');
let STORE  = require('./store');


bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(STORE);
  })
  .post(bodyParser, (req, res) => {
    console.log(req.body);
    const { title, url, desc = '', rating = 5} = req.body;

    if (!title) {
      logger.error('Title is required');
      return res
        .status(400)
        .send('A title is required');
    }

    if (!url) {
      logger.error('url is required');
      return res
        .status(400)
        .send('A url is required');
    }

    const id = uuid();

    const newBookmark = {
      id,
      title,
      url,
      desc,
      rating
    };

    STORE.push(newBookmark);
    logger.info(`New bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json(newBookmark);
  });
  

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = STORE.find(bm => bm.id === id);

    if(!bookmark) {
      logger.error(`Card with id ${id} was not found`);
      return res
        .status(404)
        .send('Not found');
    }

    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarkIndex = STORE.findIndex(bmark => bmark.id === id);
    if (bookmarkIndex === -1) {
      logger.error(`The id ${id} could not be found`);
      res
        .status(404)
        .send(`Id ${id} not found`);
    }
    
    STORE.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with id ${id} deleted.`)
    res
      .status(204)
      .end();
    
  });
  
module.exports = bookmarksRouter;