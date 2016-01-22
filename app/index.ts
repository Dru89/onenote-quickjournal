'use strict';

import token = require('./auth/token');

token.get().then(function(code) {
  console.log(`${code}`);
}).fail(function(reason) {
  console.log(`Something went wrong!\n${reason}`);
}).done(function() {
  console.log("Yeeeeey! We did it!");
})
