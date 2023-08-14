import { Layout } from './pages/layout';
import { AppStore } from './store/app-store';
import { Router } from './router';

export default class App {
    private appStore: AppStore;
    private layout: Layout;
    private router: Router;

    constructor() {
        this.router = new Router();
        this.appStore = new AppStore(this.router);
        this.layout = new Layout(this.appStore);
        this.layout.render();
    }
}
