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
