/* eslint-disable max-lines-per-function */
import { Action, ActionType, PageName, StoreEventType } from '../types';
import { Store } from './abstract/store';
import { LoginActionData } from './action/loginAction';

import CustomerAPI from '../api/customerAPI';
import { Validation, ValidationResult } from '../utils/validation';
import { RouteAction } from './action/routeAction';
import { AppStore } from './app-store';
import CartAPI from '../api/cartAPI';
import { getAPIRootWithExistingTokenFlow } from '../api/client';
import { CartActions } from './action/cartActions';

export type LoginValidationErrors = Partial<LoginActionData>;

export class LoginStore extends Store {
    private validationErrors: LoginValidationErrors;
    private loginError?: string;
    private routeAction: RouteAction;
    private appStore: AppStore;
    private cartAction: CartActions = new CartActions();

    constructor(appStore: AppStore) {
        super();
        this.validationErrors = {};
        this.routeAction = new RouteAction();
        this.appStore = appStore;
    }

    public getValidationErrors(): LoginValidationErrors | undefined {
        return this.validationErrors;
    }

    public getLoginError(): string {
        return this.loginError || '';
    }

    private validateData(data: LoginActionData): boolean {
        this.validationErrors = {};
        this.loginError = '';
        let result: ValidationResult = Validation.checkEmail(data.email);
        if (!result.isValid) {
            this.validationErrors.email = result.error;
        }
        result = Validation.checkPassword(data.password);
        if (!result.isValid) {
            this.validationErrors.password = result.error;
        }
        return result.isValid;
    }

    private onLogin(jsonData: string): void {
        const data: LoginActionData = JSON.parse(jsonData);
        const customerAPI = new CustomerAPI(data.email, data.password);

        this.validateData(data);
        if (this.validateData(data) == true) {
            customerAPI
                .loginCustommer()
                .then(() => {
                    this.routeAction.changePage({ addHistory: true, page: PageName.INDEX });
                    getAPIRootWithExistingTokenFlow()
                        .me()
                        .carts()
                        .get()
                        .execute()
                        .then((data) => {
                            if (data.body.results.length == 0) {
                                new CartAPI(!localStorage.getItem('cartID')).createCartForCurrentCustomer({
                                    currency: 'USD',
                                });
                            } else {
                                localStorage.setItem('cartAnonID', data.body.results[0].id);
                                this.appStore.getCartStore().updateCart();
                                this.emit(StoreEventType.LOGIN);
                            }
                        });
                })
                .catch((error) => {
                    this.loginError = error.message;
                    this.emit(StoreEventType.LOGIN_ERROR);
                });
        }

        this.emit(StoreEventType.LOGIN_ERROR);
    }

    protected actionCallback(action: Action): void {
        switch (action.actionType) {
            case ActionType.LOGIN:
                this.onLogin(action.data);
                break;
        }
    }
}
