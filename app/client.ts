'use strict';

import request = require('request');
import qs = require('querystring');

interface TokenRequestData {
  grant_type: string,
  code?: string,
  refresh_token?: string
};

type TokenResponse = (data: {[s: string]: any}) => void;

class LiveConnectClient {
  private authUrl: string = 'https://login.live.com/oauth20_authorize.srf';
  private tokenUrl: string = 'https://login.live.com/oauth20_token.srf';

  constructor(private clientId: string, private clientSecret: string,
              private redirectUri: string) {
  }

  public getAuthUrl(): string {
    let query = {
      'client_id': this.clientId,
      'scope': 'wl.signin wl.basic wl.offline_access office.onenote_create',
      'redirect_uri': this.redirectUri,
      'display': 'page',
      'locale': 'en',
      'response_type': 'code',
    }
    return `${this.authUrl}?${qs.stringify(query)}`
  }

  public requestTokenByAuthCode(code: string, callback: TokenResponse): void {
    this.requestToken({ code, grant_type: 'authorization_code' }, callback);
  }

  private requestToken(data: TokenRequestData, callback: TokenResponse): void {
    request.post({
      url: this.tokenUrl,
      form: Object.assign({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri
      }, data)
    }, function (err, response, body) {
      if (err) {
        callback({});
      } else {
        callback(JSON.parse(body));
      }
    });
  }
}

let config = require('./config');
export = new LiveConnectClient(config.clientId, config.clientSecret,
                               config.redirectUri);
