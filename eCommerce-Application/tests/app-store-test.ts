/**
 * @jest-environment jsdom
 */

import { Router } from "../src/router";
import { RouteAction } from "../src/store/action/routeAction";
import { AppStore } from "../src/store/app-store";
import { CartStore } from "../src/store/cart-store";
import { PageName } from "../src/types";

test('appStore.constructor', () => {

  const appStore = new AppStore(new Router(), new CartStore());
  
  expect(appStore.getCurrentPage()).toBe(PageName.INDEX);
  expect(appStore.getIsAnonUser()).toBe(true);
});

test('appStore.changePage', () => {

  const appStore = new AppStore(new Router(), new CartStore());
  const action = new RouteAction();
  action.changePage({addHistory: false, page: PageName.LOGIN});
  
  expect(appStore.getCurrentPage()).toBe(PageName.LOGIN);
});