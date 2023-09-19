import './about.scss';
import { Page } from '../abstract/page';
import createElement from '../../utils/create-element';

import rssLogo from '../../assets/rss-logo.svg';
import htmlToElement from '../../utils/html-to-element';
import GitHubLink from '../../components/link-github/link-github';

type Person = {
    name: string;
    gitName: string;
    gitLink: string;
    photo: string;
    text: string;
};

const GREETING_TEXT = `Hello, everyone! We're the Positive Code Crafters team, and this is our final project for the JavaScript/Front-end course at The Rolling Scopes School.`;
const RESP_TEXT = `Svetlana Sbaumgertner (team lead): set up the application structure, developed routing, worked on the "Registration", "Detailed Product" and "Basket" pages. 
Yulia Novoselova: managed the initial setup of the project in eCommerce tools and worked with their API, developed the "Login" and "User Profile" pages.
Illia Sakharau: created the design of the application, managed the board, was responsible for filling the project in eCommerce tools, worked on the "Header & Footer", "Main", "Catalog", and "About Us" pages.
Although we chose Svetlana Sbaumgertner as our team leader, we made all decisions together. During the project, we supported each other and helped each other with any problems that arose.`;
const MENTORS_INFO: Person[] = [
    {
        name: 'Alex Ger',
        gitName: 'alexger95',
        gitLink: 'https://github.com/alexger95',
        // eslint-disable-next-line no-undef
        photo: require('../../assets/img/mentor-alex.jpg'),
        text: '',
    },
    {
        name: 'Maksim Rynkov',
        gitName: 'maximzmei',
        gitLink: 'https://github.com/maximzmei',
        // eslint-disable-next-line no-undef
        photo: require('../../assets/img/mentor-maks.jpg'),
        text: '',
    },
];
const MEMBERS_INFO: Person[] = [
    {
        name: 'Yulia Novoselova',
        gitName: 'Jully13',
        gitLink: 'https://github.com/jully13',
        // eslint-disable-next-line no-undef
        photo: require('../../assets/img/photo-jully.jpg'),
        text: `I am a starting front end developer. Last year I made a decision to try myself at programming. And by chance I found a repost of RS School Front-end Course on social media. To be honest, at that time I knew nothing about git, github and java-script. And my start was rather difficult. But the process of education was to my liking. Today I have already obtained an appropriate knowledge base to try myself as an front-end developer.`,
    },
    {
        name: 'Svetlana baumgertner',
        gitName: 'sbaumgertner',
        gitLink: 'https://github.com/sbaumgertner',
        // eslint-disable-next-line no-undef
        photo: require('../../assets/img/photo-sveta.jpg'),
        text: `I've been working in software development for more than 10 years. I started with flash programming. Then I worked on the development, support and integration of university information systems. Lately I've been working at Netcracker as a java developer. Now I'm on maternity leave and it's time to try frontend!`,
    },
    {
        name: 'Illia Sakharau ',
        gitName: 'Illia-Sakharau',
        gitLink: 'https://github.com/Illia-Sakharau',
        // eslint-disable-next-line no-undef
        photo: require('../../assets/img/photo-illiya.jpg'),
        text: `I am a UX/UI designer with 2 years of commercial experience who wants to understand the front-end better in order to improve my work. And, now I've decided to fully dedicate myself to front-end development.`,
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
            const mentorEl = this.createMentorItem(mentor);
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
        const listEl = createElement({ tag: 'div', classes: ['members__list'] });
        MEMBERS_INFO.forEach((member) => {
            const memberEl = this.createMemberItem(member);
            listEl.append(memberEl);
        });

        wrapperEl.append(titleEl, listEl);
        sectionEl.append(wrapperEl);
        return sectionEl;
    }

    private createMemberItem(member: Person): HTMLElement {
        const { name, photo, text, gitName, gitLink } = member;
        const memberItemEl = createElement({ tag: 'div', classes: ['member'] });
        const photoEl = createElement({ tag: 'img', classes: ['member__photo'] });
        const headerEl = createElement({ tag: 'div', classes: ['member__header'] });
        const nameEl = createElement({ tag: 'h6', classes: ['member__name'], text: name });
        const githubEl = new GitHubLink({ name: gitName, link: gitLink }).getComponent();
        const textEl = createElement({ tag: 'p', classes: ['member__text'], text: text });

        photoEl.setAttribute('src', photo);
        headerEl.append(nameEl, githubEl);
        memberItemEl.append(photoEl, headerEl, textEl);
        return memberItemEl;
    }

    private createMentorItem(mentor: Person): HTMLElement {
        const { name, photo, gitName, gitLink } = mentor;
        const mentorItemEl = createElement({ tag: 'div', classes: ['mentor'] });
        const photoEl = createElement({ tag: 'img', classes: ['mentor__photo'] });
        const headerEl = createElement({ tag: 'div', classes: ['mentor__header'] });
        const nameEl = createElement({ tag: 'h6', classes: ['mentor__name'], text: name });
        const githubEl = new GitHubLink({ name: gitName, link: gitLink }).getComponent();

        photoEl.setAttribute('src', photo);
        headerEl.append(nameEl, githubEl);
        mentorItemEl.append(photoEl, headerEl);
        return mentorItemEl;
    }
}
