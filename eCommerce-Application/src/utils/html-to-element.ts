export default function (htmlString: string): HTMLElement {
    const template: HTMLTemplateElement = document.createElement('template');
    template.innerHTML = htmlString.trim();
    if (!(template.content.firstChild instanceof HTMLElement)) {
        throw new Error('Check template.');
    } else {
        return template.content.firstChild;
    }
}
