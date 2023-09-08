export function checkboxChecking(
    billingAddressCheckbox: HTMLElement,
    billingDefaultCheckbox: HTMLElement,
    shippingAddressCheckbox: HTMLElement,
    shippingDefaultCheckbox: HTMLElement
): void {
    if (
        billingAddressCheckbox.classList.contains('checkbox_checked') === false &&
        billingDefaultCheckbox.classList.contains('disabled') == false
    ) {
        billingDefaultCheckbox.classList.add('disabled');
    }
    if (
        shippingAddressCheckbox.classList.contains('checkbox_checked') == false &&
        shippingDefaultCheckbox.classList.contains('disabled') == false
    ) {
        shippingDefaultCheckbox.classList.add('disabled');
    }
}
