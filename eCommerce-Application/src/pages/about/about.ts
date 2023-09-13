import './about.scss';
import { Page } from '../abstract/page';
import createElement from '../../utils/create-element';

import rssLogo from '../../assets/rss-logo.svg';
import htmlToElement from '../../utils/html-to-element';

const GREETING_TEXT = `Hello, everyone! We're the Positive Code Crafters team, and this is our final project for the JavaScript/Front-end course at The Rolling Scopes School.`;
const RESP_TEXT = `Svetlana Sbaumgertner (team lead): set up the application structure, developed routing, worked on the "Registration" and "Detailed Product" pages. 
Yulia Novoselova: managed the initial setup of the project in eCommerce tools and worked with their API, developed the "Login" and "User Profile" pages.
Illia Sakharau: created the design of the application, managed the board, was responsible for filling the project in eCommerce tools, worked on the "Header & Footer", "Main Page", and "Catalog" pages.
Although we chose Svetlana Sbaumgertner as our team leader, we made all decisions together. During the project, we supported each other and helped each other with any problems that arose.`;
const MENTORS_INFO = [
    {
        name: 'Alex Ger',
        git: 'https://github.com/alexger95',
    },
    {
        name: 'Maksim Rynkov',
        git: 'https://github.com/maximzmei',
    },
];

export class AboutPage extends Page {
    private sectionEL: HTMLElement = this.createHeroSection();
    private schoolSectionEL: HTMLElement = this.createSchoolSection();
    private membersSectionEL: HTMLElement = this.createMembersSection();

    constructor() {
        super();
    }

    public render(): void {
        this.html = document.createElement('div');
        this.html.append(this.sectionEL, this.schoolSectionEL, this.membersSectionEL);
    }

    private createHeroSection(): HTMLElement {
        const sectionEl = createElement({ tag: 'section', classes: ['hero'] });
        const wrapperEl = createElement({ tag: 'div', classes: ['wrapper', 'hero__wrapper'] });
        const titleEl = createElement({ tag: 'h2', classes: ['hero__title'], text: 'Positive Code Crafters' });
        const greetingEl = createElement({ tag: 'p', classes: ['hero__greeting'], text: GREETING_TEXT });
        const respArticlEl = this.createRespArticle();
        const mentorsArticlEl = this.createMentorsArticle();

        wrapperEl.append(titleEl, greetingEl, respArticlEl, mentorsArticlEl);
        sectionEl.append(wrapperEl);
        return sectionEl;
    }

    private createRespArticle(): HTMLElement {
        const articleEl = createElement({ tag: 'article', classes: ['hero__article', 'resp'] });
        const titleEl = createElement({
            tag: 'h5',
            classes: ['resp__title'],
            text: 'Project responsibilities',
        });
        const respTextParagraph = RESP_TEXT.split(/\n/);

        respTextParagraph.forEach((p) => {
            const textEl = createElement({ tag: 'p', classes: ['resp__text'], text: p });
            articleEl.append(titleEl, textEl);
        });

        articleEl.prepend(titleEl);
        return articleEl;
    }

    private createMentorsArticle(): HTMLElement {
        const articleEl = createElement({ tag: 'article', classes: ['hero__article', 'mentors'] });
        const titleEl = createElement({
            tag: 'h5',
            classes: ['mentors__title'],
            text: 'Our mentors',
        });
        const listEl = createElement({ tag: 'div', classes: ['mentors__list'] });
        MENTORS_INFO.forEach((mentor) => {
            const mentorEl = createElement({ tag: 'div', classes: ['mentors__mentor'], text: mentor.name });
            listEl.append(mentorEl);
        });

        articleEl.prepend(titleEl, listEl);
        return articleEl;
    }

    private createSchoolSection(): HTMLElement {
        const sectionEl = createElement({ tag: 'section', classes: ['school'] });
        const wrapperEl = createElement({ tag: 'div', classes: ['wrapper', 'school__wrapper'] });
        const linkEl = htmlToElement(`<a href="https://rs.school/js/" target="_blank" class="school__link">
                ${rssLogo}
            </a>`);

        wrapperEl.append(linkEl);
        sectionEl.append(wrapperEl);
        return sectionEl;
    }

    private createMembersSection(): HTMLElement {
        const sectionEl = createElement({ tag: 'section', classes: ['members'] });
        const wrapperEl = createElement({ tag: 'div', classes: ['wrapper', 'members__wrapper'] });
        const titleEl = createElement({
            tag: 'h2',
            classes: ['members__title'],
            text: 'About the team members',
        });

        wrapperEl.append(titleEl);
        sectionEl.append(wrapperEl);
        return sectionEl;
    }
}
