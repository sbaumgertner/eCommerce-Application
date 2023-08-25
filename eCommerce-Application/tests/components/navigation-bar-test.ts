/**
 * @jest-environment jsdom
 */

import NavigationBar from "../../src/components/navigation-bar/navigation-bar";
import { Router } from "../../src/router";
import { RouteAction } from "../../src/store/action/routeAction";
import { AppStore } from "../../src/store/app-store";
import { PageName } from "../../src/types";

test('navigarionBar.constructor', () => {

  const appStore = new AppStore(new Router());
  const nav = new NavigationBar(appStore, 
    [{page: PageName.LOGIN, text: 'LOGIN'}, {page: PageName.REGISTRATION, text: 'REGISTRATION'}]);
  const el = nav.getComponent();
  
  expect(el.classList.contains('nav-bar')).toBe(true);
  expect(el.childNodes.length).toBe(2);

});

test('navigarionBar.changePage', () => {

  const appStore = new AppStore(new Router());
  const nav = new NavigationBar(appStore, 
    [{page: PageName.LOGIN, text: 'LOGIN'}, {page: PageName.REGISTRATION, text: 'REGISTRATION'}]);
  const el = nav.getComponent();
  const action = new RouteAction();
  action.changePage({addHistory: false, page: PageName.REGISTRATION});
  
  expect(el.querySelector('.current')?.textContent).toBe('REGISTRATION');

});