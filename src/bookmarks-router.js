const express = require('express');
const logger = require('./logger');
const bookmarksRouter = express.Router();
const bodyParser = express.json();
const uuid = require('uuid/v4');
const STORE  = require('./store');


bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    console.log(STORE);
    res.json(STORE);
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
        .send('Could not find that card');
    }

    res.json(bookmark);
  });
module.exports = bookmarksRouter;