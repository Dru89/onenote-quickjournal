'use strict';
require('source-map-support').install();

import app = require('./app');
app.set('port', process.env.PORT || 32567);

let server = app.listen(app.get('port'), function() {
  console.log(`Listening on port ${server.address().port}`);
});

export = server;
