import './link-github.scss';
import { CreatorGithubInfo, ElementParams } from '../../types';
import Component from '../abstract/component';
import createElement from '../../utils/create-element';
import htmlToElement from '../../utils/html-to-element';

import githubLogoImg from '../../assets/icons/github-logo.svg';

export default class GitHubLink extends Component {
    constructor(info: CreatorGithubInfo) {
        const ghLinkParams: ElementParams = {
            tag: 'a',
            classes: ['gh-link'],
        };
        super(ghLinkParams);
        this.render(info);
    }

    public render(info: CreatorGithubInfo): void {
        const iconEl = htmlToElement(`<div class="gh-link__icon">${githubLogoImg}</div>`);
        const textEl = createElement({ tag: 'span', classes: ['gh-link__text'], text: info.name });
        this.componentElem.innerHTML = '';
        this.componentElem.setAttribute('href', info.link);
        this.componentElem.setAttribute('target', '_blank');
        this.componentElem.append(iconEl, textEl);
    }
}
