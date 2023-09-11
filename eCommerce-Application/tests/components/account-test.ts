/**
 * @jest-environment jsdom
 */

import { AccountStore } from '../../src/store/account-store';
import { manageEcom } from '../../src/api/manageEcom';

const mockManageEcom = {
    getCustomerById: jest.fn().mockResolvedValue({ body: {} }),
};

const accountStore = new AccountStore();
accountStore.manageEcom = mockManageEcom as unknown as manageEcom;

test('returns the summary errors', () => {
    expect(accountStore.getSummaryErrors()).toBeUndefined();
});

test('gets the customer information', async () => {
    await accountStore.getCustomerInfo();
    expect(mockManageEcom.getCustomerById).toHaveBeenCalled();
});

// test('sets the email info', async () => {
//     const emailInfoElement = document.createElement('div');
//     const email = 'test@example.com';

//     mockManageEcom.getCustomerById.mockResolvedValueOnce({ body: { email } });

//     const result = await accountStore.getEmailInfo(emailInfoElement);

//     expect(result).toBe(email);
//     expect(emailInfoElement.innerHTML).toBe(email);
//     expect(accountStore.email).toBe(email);
// });

// test('gets the full customer name', async () => {
//     const fullNameElement = document.createElement('div');

//     const firstName = 'John';
//     const lastName = 'Doe';

//     mockManageEcom.getCustomerById.mockResolvedValueOnce({ body: { firstName, lastName } });

//     await accountStore.getFullCustomerName(fullNameElement);

//     expect(fullNameElement.innerHTML).toBe(`${firstName} ${lastName}`);
// });
