/**
 * @jest-environment jsdom
 */
import PopUp from '../../src/components/pop-up/popUp';

describe('PopUp', () => {
    // Create a temporary container element for testing
    const title = 'Popup Title';
    const content = document.createElement('div');
    const errorMessage = document.createElement('div');
    const button = document.createElement('button');

    const popUp = new PopUp(title, content, errorMessage, button);
    const popUpElem = popUp.getComponent();

    test('formField should be an inctance of FormFiels', () => {
        expect(popUpElem.tagName).toBe('DIV');
    });

    test('formField should be an inctance of FormFiels', () => {
        expect(popUpElem.classList.contains('dimming-window')).toBe(true);
    });

    test('formField should be an inctance of FormFiels', () => {
        expect(popUp instanceof PopUp).toBeTruthy();
    });

    test('formField should be an inctance of FormFiels', () => {
        expect(typeof popUp.closePopUp).toBe('function');
    });
});
