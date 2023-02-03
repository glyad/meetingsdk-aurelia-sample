import { PLATFORM, autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';

@autoinject
export class App {
  
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    config.title = 'Zoom.us';
    
    config.map([
      { route: ['', 'home'], name: 'home', moduleId:PLATFORM.moduleName('./home'), nav:true,  title:'Zoom.us' },
      { route: 'webhooks', name: 'webhooks', moduleId:PLATFORM.moduleName('./webhooks'), nav:true,  title:'Zoom.us' }
    ]);

    
  }
}
