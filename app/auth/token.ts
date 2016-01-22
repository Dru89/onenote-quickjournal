'use strict';

import fs = require('fs');
import q = require('q');
import expand = require('expand-tilde');
import TokenData = require('./data');
import server = require('./server');
let cfg = require('../config');

function read(path: string) {
  return fs.readFileSync(path, 'utf-8');
}

export function get(): q.Promise<string>  {
  let deferred = q.defer<string>();
  let path = expand(cfg.clientConfig)
  let token: string;
  fs.exists(path, function(exists) {
    if (exists) {
      try {
        let data: TokenData = JSON.parse(read(path));
        if (data.auth_token) {
          // TODO: Handle auth token expiry.
          if (!data.expires || data.expires < Date.now()) {
            token = data.auth_token;
          }
        }
      } catch (e) {
        console.warn(`Couldn't read ${path} to get auth token.`);
      }
    }

    if (!token) {
      console.log('Getting authorization from One Note.')
      server.start().tap(server.openAuthUrl).then(function() {
        return server.authorize();
      }).then(function(data) {
        console.log("got token data");
        console.log(data);
        return data.auth_token;
      }).tap(server.stop).then(function(token) {
        deferred.resolve(token);
      });
    } else {
      deferred.resolve(token);
    }
  });

  return deferred.promise;
}
