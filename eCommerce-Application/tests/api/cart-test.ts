/**
 * @jest-environment jsdom
 */
import { CartStore } from '../../src/store/cart-store';
import CartAPI from '../../src/api/cartAPI';

const mocCart = {
    getActiveCart: jest.fn().mockResolvedValue({ body: {} }),
    updateActiveCart: jest.fn().mockResolvedValue({ body: {} }),
    addPromocode: jest.fn().mockResolvedValue({ body: {} }),
};

const cartStore = new CartStore();
(cartStore as any).cartAPI = mocCart as unknown as CartAPI;

test('returns promo codes', () => {
    expect(cartStore.getPromoCode()).toBeUndefined();
});

test('returns sutotal price', () => {
    expect(typeof cartStore.getSubtotalPrice()).toBe('number');
});

test('returns cart item amount', () => {
    expect(typeof cartStore.getCartItemAmount()).toBe('number');
});

test('returns total price', () => {
    expect(typeof cartStore.getTotalPrice()).toBe('number');
});

test('returns has promo', () => {
    expect(typeof cartStore.hasPromo()).toBe('boolean');
});

test('get active cart', async () => {
    await (cartStore as any).getCart();
    expect(mocCart.getActiveCart).toHaveBeenCalled();
});

test('gets onIncItem', async () => {
    await (cartStore as any).onIncItem();
    expect(mocCart.updateActiveCart).toHaveBeenCalled();
});
