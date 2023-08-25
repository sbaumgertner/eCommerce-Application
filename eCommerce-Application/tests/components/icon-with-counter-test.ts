/**
 * @jest-environment jsdom
 */
import IconWithCounter from '../../src/components/icon-with-counter/icon-with-counter';

describe('IconWithCounter', () => {
    let iconWithCounter: IconWithCounter;

    beforeEach(() => {
        // Create a temporary container element for testing
        const container = document.createElement('div');
        document.body.appendChild(container);

        // Instantiate the Checkbox component
        iconWithCounter = new IconWithCounter('Test Label', 'filled', 1);
        container.appendChild(iconWithCounter.getComponent());
    });

    afterEach(() => {
        // Clean up the temporary container element
        iconWithCounter.getComponent().remove();
    });

    test('render method should add classlist icon-count', () => {
        expect(iconWithCounter.getComponent().classList.contains('icon-count')).toBe(true);
    });
});
