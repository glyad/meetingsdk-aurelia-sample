export class Home {
  public message = 'Hello World!';
  public clientId = process.env.CLIENT_ID;

  public users;


  async activate(params, routeConfig, navigationInstruction) {
    //let url = 'https://zoom.us/oauth/token?grant_type=authorization_code&code=' + req.query.code + '&redirect_uri=' + process.env.redirectURL;
    const authUrl = process.env.AUTH_MY_APP_URL;
    console.log(params.length, routeConfig, navigationInstruction);

    // const response: Response = await fetch(authUrl, {
    //     method: 'GET', // *GET, POST, PUT, DELETE, etc.
    //     mode: 'no-cors', // no-cors, *cors, same-origin
    //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //     credentials: 'omit',
    //   });
  }
}