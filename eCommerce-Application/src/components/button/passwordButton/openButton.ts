import './passwordButton.scss';
import { IconButton } from '../button';
import eyeClosedIcon from '../../../assets/icons/icon-eye-close.svg';

export default class ClosePasswordButton extends IconButton {
    constructor() {
        super({ icon: eyeClosedIcon, type: 'clear' });
        this.componentElem.classList.add('eye-button');
    }

    public openPassword(button: HTMLElement): void {
        this.componentElem.addEventListener('click', (): void => {
            if ((document.querySelector('[name="password"]') as HTMLInputElement).type === 'password') {
                (document.querySelector('[name="password"]') as HTMLInputElement).type = 'text';
                this.componentElem.style.display = 'none';
                button.style.display = 'block';
            } else {
                (document.querySelector('[name="password"]') as HTMLInputElement).type = 'password';
                button.style.display = 'none';
            }
        });
    }
}
