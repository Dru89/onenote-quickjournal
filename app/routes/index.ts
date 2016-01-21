'use strict';

import express = require('express');

import client = require('../client');

let router = express.Router();

router.get('/', function(req,res) {
  res.render('index', {
    title: 'OneNote Alfred Journal',
    authUrl: client.getAuthUrl()
  });
});

router.post('/', function(req, res) {
  let accessToken = req.cookies['access_token'];
  let exampleType = req.body['submit'];

  let handler = function(err: Error, response: express.Response, body: string) {
    if (err) {
      return res.render('error', {
        message: 'HTTP Error',
        error: { details: JSON.stringify(err, null, 2) }
      })
    }

    let parsedBody: any;
    try {
      parsedBody = JSON.parse(body);
    } catch (e) {
      parsedBody = {};
    }

    let resource: string = parsedBody['links'] ?
        parsedBody['links']['oneNoteWebUrl']['href'] :
        null;

    if (resource) {
      res.render('result', {
        title: 'OneNote API Result',
        body: body,
        resourceUrl: resource
      });
    } else {
      res.render('error', {
        message: 'OneNote API Error',
        error: { status: response.statusCode, details: body }
      });
    }
  };

  console.log("This is where we would add stuff to OneNote.");
});

export = router;
