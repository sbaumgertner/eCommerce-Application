import './passwordButton.scss';
import { IconButton } from '../button';
import eyeOpenIcon from '../../../assets/icons/icon-eye-open.svg';

export default class OpenPasswordButton extends IconButton {
    constructor() {
        super({ icon: eyeOpenIcon, type: 'clear' });
        this.componentElem.classList.add('eye-button');
        this.componentElem.style.display = 'none';
    }

    public closePassword(button: HTMLElement): void {
        this.componentElem.addEventListener('click', (): void => {
            if ((document.querySelector('[name="password"]') as HTMLInputElement).type === 'text') {
                (document.querySelector('[name="password"]') as HTMLInputElement).type = 'password';
                this.componentElem.style.display = 'none';
                button.style.display = 'block';
            } else {
                (document.querySelector('[name="password"]') as HTMLInputElement).type = 'text';
                button.style.display = 'none';
            }
        });
    }
}
