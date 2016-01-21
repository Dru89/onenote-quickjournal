'use strict';

import express = require('express');
import client = require('../client');

let router = express.Router();
router.get('/', function (req, res) {
  let authCode: string = req.query['code'];
  if (authCode) {
    client.requestTokenByAuthCode(authCode, function(response) {
      let accessToken: string = response['access_token'];
      let refreshToken: string = response['refresh_token'];
      let expiresIn: number = response['expires_in'];
      if (accessToken && refreshToken && expiresIn) {
        res.cookie('access_token', accessToken, { maxAge: expiresIn * 1000});
        res.cookie('refresh_token', refreshToken);
        res.render('callback');
      } else {
        res.render('error', {
          message: 'Invalid Live Connect Response',
          error: { details: JSON.stringify(response, null, 2) }
        })
      }
    });
  } else {
    let error: string = req.query['error'];
    let description: string = req.query['error_description'];

    res.render('error', {
      message: 'Live Connect Auth Error',
      error: { status: error, details: description }
    })
  }
});

export = router;
