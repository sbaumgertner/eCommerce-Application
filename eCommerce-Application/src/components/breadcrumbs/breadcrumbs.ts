import './breadcrumbs.scss';
import Component from '../abstract/component';
import { ElementParams } from '../../types';
import createElement from '../../utils/create-element';

export default class Breadcrumbs extends Component {
    constructor(path: string) {
        const breadcrumbsParams: ElementParams = {
            tag: 'nav',
            classes: ['breadcrumbs'],
        };
        super(breadcrumbsParams);
        this.render(path);
    }

    private render(path: string): void {
        const pathArray = this.preparePath(path);
        pathArray.forEach((linkText, index) => {
            const currentLevel = path.split('/')[index + path.split('/').length - pathArray.length];
            const linkPath = path.slice(0, path.indexOf(currentLevel)) + currentLevel;
            if (index < pathArray.length - 1) {
                this.componentElem.append(this.createLink(linkText, linkPath));
                this.componentElem.append(this.createSeparator());
            } else {
                this.componentElem.append(this.createLink(linkText));
            }
        });
    }

    private preparePath(path: string): string[] {
        let arr = path.split('/');
        arr.splice(0, arr.indexOf('catalog'));
        arr.unshift('Home');
        arr = arr.map((linkText) => {
            if (linkText[0]) {
                return linkText[0].toUpperCase() + linkText.slice(1);
            } else {
                return '';
            }
        });
        return arr;
    }

    private createLink(text: string, path?: string): HTMLLinkElement {
        const linktEl = createElement({ tag: 'a', classes: ['breadcrumbs__link'], text }) as HTMLLinkElement;
        if (path) {
            linktEl.setAttribute('href', path);
            linktEl.classList.add('breadcrumbs__link_active');
        }
        return linktEl;
    }

    private createSeparator(): HTMLElement {
        const separatorEl = createElement({ tag: 'div', classes: ['breadcrumbs__separator'], text: '/' });
        return separatorEl;
    }
}
