/**
 * @jest-environment jsdom
 */
import FormField from '../../src/components/form-field/form-field';
import Input from '../../src/components/input/input';
import { InputElementParams } from '../../src/types';

describe('FormField', () => {
    let formField: FormField;

    beforeEach(() => {
        // Create a temporary container element for testing
        const container = document.createElement('div');
        document.body.appendChild(container);

        // Instantiate the Checkbox component
        const inputParams: InputElementParams = {
            classes: ['my-input'],
            id: 'inputId',
            type: 'text',
            name: 'inputName',
            placeholder: 'Enter your name',
        };
        const input = new Input(inputParams);
        formField = new FormField('label', input);
        container.appendChild(formField.getComponent());
    });

    afterEach(() => {
        // Clean up the temporary container element
        formField.getComponent().remove();
    });

    test('formField should be an inctance of FormFiels', () => {
        expect(formField instanceof FormField).toBeTruthy();
    });

    test('formField should have a method render()', () => {
        expect(typeof formField.render).toBe("function");
    });
});
