import { AppView } from '../pages/app-view';
import { AppStore } from '../store/app-store';
import { Router } from './router';

export default class App {
    private appStore: AppStore;
    private appView: AppView;
    private router: Router;

    constructor() {
        console.log(window.location);
        this.router = new Router();
        this.appStore = new AppStore(this.router);
        this.appView = new AppView(this.appStore);
        this.appView.render();
    }
}
