/**
 * @jest-environment jsdom
 */
import { Checkbox } from '../../src/components/checkbox/checkbox';

describe('Checkbox', () => {
    let checkbox: Checkbox;

    beforeEach(() => {
        // Create a temporary container element for testing
        const container = document.createElement('div');
        document.body.appendChild(container);

        // Instantiate the Checkbox component
        checkbox = new Checkbox('Test Label');
        container.appendChild(checkbox.getComponent());
    });

    afterEach(() => {
        // Clean up the temporary container element
        checkbox.getComponent().remove();
    });

    test('render method should correctly render the label', () => {
        expect(checkbox.getComponent().querySelector('.checkbox-label')?.textContent).toBe('Test Label');
    });

    test('getValue method should return false by default', () => {
        expect(checkbox.getValue()).toBe(false);
    });

    test('setChecked method should add "checkbox_checked" class', () => {
        checkbox.setChecked();
        expect(checkbox.getComponent().querySelector('.checkbox')?.classList.contains('checkbox_checked')).toBe(true);
    });
});
