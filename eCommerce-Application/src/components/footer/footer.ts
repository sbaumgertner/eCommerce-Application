import './footer.scss';
import { CreatorGithubInfo, ElementParams, PageName } from '../../types';
import Component from '../abstract/component';
import createElement from '../../utils/create-element';
import htmlToElement from '../../utils/html-to-element';
import GitHubLink from '../link-github/link-github';

import lightLogoImg from '../../assets/logo-light.svg';
import rssLogoImg from '../../assets/rss-logo.svg';
import NavigationBar from '../navigation-bar/navigation-bar';
import { AppStore } from '../../store/app-store';
import { RouteAction } from '../../store/action/routeAction';

const CreatorsGithubInfo: CreatorGithubInfo[] = [
    {
        name: 'Jully13',
        link: 'https://github.com/Jully13',
    },
    {
        name: 'sbaumgertner',
        link: 'https://github.com/sbaumgertner',
    },
    {
        name: 'Illia-Sakharau',
        link: 'https://github.com/Illia-Sakharau',
    },
];
const FooterNavLinks: PageName[] = [PageName.LOGIN, PageName.REGISTRATION];

export default class Footer extends Component {
    private appStore: AppStore;
    private routeAction: RouteAction = new RouteAction();

    constructor(appStore: AppStore) {
        const footerParams: ElementParams = {
            tag: 'footer',
            classes: ['footer'],
        };
        super(footerParams);
        this.appStore = appStore;
        this.render();
    }

    public render(): void {
        this.componentElem.innerHTML = '';
        this.componentElem.append(this.createWrapper());
    }

    private createWrapper(): HTMLElement {
        const wrapperEl = createElement({ tag: 'div', classes: ['footer__wrapper'] });
        wrapperEl.append(this.createTopLine(), this.createBottomLine());
        return wrapperEl;
    }

    private createTopLine(): HTMLElement {
        const topLineEl = createElement({ tag: 'div', classes: ['footer__top-line'] });
        const logoEl = htmlToElement(`<a class="footer__logo">${lightLogoImg}</div>`);
        const menuEl = new NavigationBar(this.appStore, FooterNavLinks, 'light').getComponent();
        menuEl.classList.add('footer__menu');
        logoEl.addEventListener('click', () => this.routeAction.changePage({ addHistory: true, page: PageName.INDEX }));

        topLineEl.append(logoEl, menuEl);
        return topLineEl;
    }

    private createBottomLine(): HTMLElement {
        const bottmLineEl = createElement({ tag: 'div', classes: ['footer__bottom-line'] });
        const creatorsEl = this.createCreators();
        const schoolEl = this.createSchoolSection();

        bottmLineEl.append(creatorsEl, schoolEl);

        return bottmLineEl;
    }

    private createCreators(): HTMLElement {
        const creatorsEl = createElement({ tag: 'div', classes: ['creators'] });
        const creatorsTitleEl = createElement({ tag: 'h6', classes: ['creators__title'], text: 'Created by' });
        const creatorsListEl = createElement({ tag: 'div', classes: ['creators__list'] });

        CreatorsGithubInfo.forEach((creator) => {
            creatorsListEl.appendChild(new GitHubLink(creator).getComponent());
        });
        creatorsEl.append(creatorsTitleEl, creatorsListEl);

        return creatorsEl;
    }

    private createSchoolSection(): HTMLElement {
        const sectionEl = createElement({ tag: 'div', classes: ['footer__school-wrapper'] });
        const schoolEl = htmlToElement(`<a href="https://rs.school/js/" target="_blank" class="footer__rss">
                ${rssLogoImg}
            </a>`);
        const yearEl = createElement({ tag: 'span', classes: ['footer__copyright'], text: '© 2023' });

        sectionEl.append(schoolEl, yearEl);

        return sectionEl;
    }
}
