import './link-navigation.scss';
import { ElementParams, LinkProps } from '../../types';
import Component from '../abstract/component';
import createElement from '../../utils/create-element';

export default class NavLink extends Component {
    constructor(linkProps: LinkProps, color: 'light' | 'dark' = 'dark') {
        const navLinkParams: ElementParams = {
            tag: 'a',
            classes: ['nav-link', `nav-link_${color}`],
        };
        super(navLinkParams);
        this.render(linkProps);
    }

    public render(linkProps: LinkProps): void {
        const { page, text } = linkProps;
        const textEl = createElement({ tag: 'div', classes: ['nav-link__text'], text: text });
        this.componentElem.innerHTML = '';
        this.componentElem.dataset.page = page;
        this.componentElem.append(textEl);
    }
}
