'use strict';

import express = require('express');
import q = require('q');
import TokenData = require('./data');
import client = require('../client');
import http = require('http');
import net = require('net');
import open = require('open');
import bodyParser = require('body-parser');

let app = express();
let server: http.Server;
let sockets: net.Socket[] = [];
app.set('port', process.env.PORT || 32567);
app.use(bodyParser.json());

export function openAuthUrl(): void {
  open(client.getAuthUrl());
}

export function start(): q.Promise<void> {
  console.log("Starting server...");
  let deferred = q.defer<void>();
  server = app.listen(app.get('port'), deferred.resolve);
  server.on('connection', function(socket: net.Socket) { sockets.push(socket); })
  return deferred.promise;
}

export function stop(): q.Promise<void> {
  console.log("Stopping server...");
  let deferred = q.defer<void>();
  sockets.forEach(function(socket) {
    socket.destroy();
  });
  server.close(function() {
    console.log("Server has been stopped.");
    deferred.resolve();
  });
  return deferred.promise;
}

export function authorize(): q.Promise<TokenData> {
  let deferred = q.defer<TokenData>();

  app.get('/redirect', function(req, res) {
    let authCode: string = req.query['code'];
    if (authCode) {
      client.requestTokenByAuthCode(authCode, function(response) {

        let accessToken: string = response['access_token'];
        let refreshToken: string = response['refresh_token'];
        let expiresIn: number = response['expires_in'];

        if (accessToken) {
          // TODO: Redirect to a thanks page.
          res.redirect("http://www.google.com");
          deferred.resolve({
            auth_token: accessToken,
            refresh_token: refreshToken,
            expires: expiresIn
          });
        } else {
          // TODO: Redirect to a thanks page.
          res.redirect("http://www.yahoo.com");
          deferred.reject(new Error("Invalid Live Connect Response"));
        }
      });
    } else {
      // TODO: Redirect to a thanks page.
      res.redirect("http://www.yahoo.com");
      deferred.reject(new Error(`Live Connect Auth Error: ${req.query['error']}`));
    }
  });

  return deferred.promise;
}
