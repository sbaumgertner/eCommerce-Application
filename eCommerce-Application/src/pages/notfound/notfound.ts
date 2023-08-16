import './notfound.scss';
import { Page } from '../abstract/page';
import { Button } from '../../components/button/button';

export class NotFoundPage extends Page {
    public render(): void {
        this.html = document.createElement('div');
        this.html.className = 'wrapper-404';
        this.html.innerHTML = `
            <div>
            <img alt="404" src="../../assets/img/image-07.png">
            <p class="header-404">Where's the Greenery?</p>
            </div>
            <p class="text-404">Oh no, it seems you've taken a detour from our plant paradise.<br> Why not retrace your digital steps and find your way back to our diverse array of indoor plants?</p>
        `;
        this.html.append(new Button('filled', 'home', 'Home page').getComponent());
    }
}
