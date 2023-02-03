/* eslint-disable @typescript-eslint/no-explicit-any */
import { Aurelia } from 'aurelia-framework';
import environment from '../config/environment.json';
import { PLATFORM } from 'aurelia-pal';
import { HttpClient,json } from 'aurelia-fetch-client';
import { get, set } from 'idb-keyval';
import { Buffer } from 'buffer';

const httpAuthClient = configureHttpAuthClient(new HttpClient());
function getBase64Token(){
  return Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');
}
function configureHttpAuthClient(httpClient: HttpClient): HttpClient {
  return httpClient.configure(config => {
    config
      .withBaseUrl(process.env.BASE_AUTH_URL)
      .withDefaults({
        credentials: 'omit',
        cache: 'no-cache',
        mode: 'no-cors',
        headers: {
          'Authorization': `Basic ${getBase64Token()}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'X-Requested-With': 'Fetch'
        }
      })
      .withInterceptor({
        request(request) {
          console.log(`Requesting ${request.method} ${request.url}`);
          return request;
        },
        response(response) {
          console.log(`Received ${response.status} ${response.url}`);
          return response;
        }
      });
  });
  
}
export class AuthenticationService {

  /**
   * The credential below is a sample base64 encoded credential. 
   * Replace it with "Authorization: 'Basic ' + Buffer.from(your_app_client_id + ':' + your_app_client_secret).toString('base64')"
   * 
   * {
   *  method: 'POST',
   *  url: 'https://zoom.us/oauth/token?grant_type=client_credentials',
   *  headers: {
   *  
   *  *The credential below is a sample base64 encoded credential. Replace it with "Authorization: 'Basic ' + Buffer.from(your_app_client_id + ':' + your_app_client_secret).toString('base64')"
   *  
   *
   *  Authorization: 'Basic abcdsdkjfesjfg'
   * },}
  **/

  private static getBrowserUrlQueryParams(): URLSearchParams {
    const href = window.location.href;
    const url = new URL(href);
    const params = new URLSearchParams(url.search);
    return params;
  }

  public static hasQueryParamKey(key: string): boolean {    
    return AuthenticationService.getBrowserUrlQueryParams().has(key);
  }
  
  private static requestAccessToken(code: string) {
    return fetch('https://zoom.us/oauth/token', {
      credentials: 'omit',
      cache: 'no-cache',
      mode: 'no-cors',
      headers: {
        'Authorization': `Basic ${getBase64Token()}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'X-Requested-With': 'Fetch'
      },    
      method: 'post',
      body: json({
        code: AuthenticationService.getBrowserUrlQueryParams().get('code'),
        grant_type: 'authorization_code',
        redirect_uri: 'https://65e2-2a00-a040-19b-11bd-c13-fe81-4d62-f101.eu.ngrok.io'
      })
    })
    .then(async (response) => await response.json())
    .then(async (json) => await json.data); 
  }
  
  public static isAuthenticated(): boolean {
    return AuthenticationService.hasQueryParamKey('code');
  }

  public static authenticate(){
    const code = AuthenticationService.getBrowserUrlQueryParams().get('code');
    const accessToken = AuthenticationService.requestAccessToken(code);
    const x = accessToken;

  }
  
}

export function configure(aurelia: Aurelia): void {  

  if (AuthenticationService.hasQueryParamKey('code')) {    
    AuthenticationService.authenticate();
  } else {
    window.open(process.env.AUTH_MY_APP_URL, "_self");
  }
    
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
