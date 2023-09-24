import './notfound.scss';
import { Page } from '../abstract/page';
import { Button } from '../../components/button/button';
import { RouteAction } from '../../store/action/routeAction';
import { PageName } from '../../types';

export class NotFoundPage extends Page {
    private routeAction: RouteAction;
    private homeBtn: Button;

    constructor() {
        super();
        this.routeAction = new RouteAction();
        this.homeBtn = new Button('filled', 'home', 'Home page');
    }

    public render(): void {
        this.html = document.createElement('div');
        this.html.className = 'wrapper-404';
        this.html.innerHTML = `
            <div>
              <div class="img-404"></div>
              <p class="header-404">Where's the Greenery?</p>
            </div>
            <p class="text-404">Oh no, it seems you've taken a detour from our plant paradise.<br> Why not retrace your digital steps and find your way back to our diverse array of indoor plants?</p>
        `;
        this.html.append(this.homeBtn.getComponent());
        this.addEventListeners();
    }

    public addEventListeners(): void {
        this.homeBtn.getComponent().addEventListener('click', () => {
            this.routeAction.changePage({ addHistory: true, page: PageName.INDEX });
        });
    }
}
