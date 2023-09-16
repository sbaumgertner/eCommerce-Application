import { Layout } from './pages/layout';
import { AppStore } from './store/app-store';
import { Router } from './router';
import { CartStore } from './store/cart-store';

export default class App {
    private appStore?: AppStore;
    private cartStore: CartStore;
    private layout?: Layout;
    private router?: Router;

    constructor() {
        this.cartStore = new CartStore();
        this.cartStore.initCart().then(() => {
            this.router = new Router();
            this.appStore = new AppStore(this.router);
            this.layout = new Layout(this.appStore, this.cartStore);
            this.router.initRouter();
            this.layout.render();
        });
    }
}
