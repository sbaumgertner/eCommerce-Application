import './link-navigation.scss';
import { ElementParams, PageName } from '../../types';
import Component from '../abstract/component';
import createElement from '../../utils/create-element';

export default class NavLink extends Component {
    constructor(pageName: PageName, color: 'light' | 'dark' = 'dark') {
        const navLinkParams: ElementParams = {
            tag: 'a',
            classes: ['nav-link', `nav-link_${color}`],
        };
        super(navLinkParams);
        this.render(pageName);
    }

    public render(pageName: PageName): void {
        const textEl = createElement({ tag: 'div', classes: ['nav-link__text'], text: pageName });
        this.componentElem.innerHTML = '';
        this.componentElem.dataset.page = pageName;
        this.componentElem.append(textEl);
    }
}
