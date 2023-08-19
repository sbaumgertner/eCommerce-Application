import { Action, ActionType, PageName, StoreEventType } from '../types';
import { Store } from './abstract/store';
import { LoginActionData } from './action/loginAction';

import CustomerAPI from '../api/customerAPI';
import { Validation, ValidationResult } from '../utils/validation';
import { RouteAction } from './action/routeAction';

export class LoginStore extends Store {
    private emailError?: string;
    private passwordError?: string;
    private loginError?: string;
    private routeAction: RouteAction;

    constructor() {
        super();
        this.routeAction = new RouteAction();
    }

    public getEmailError(): string {
        return this.emailError || '';
    }

    public getPasswordError(): string {
        return this.passwordError || '';
    }

    public getLoginError(): string {
        return this.loginError || '';
    }

    private onLogin(jsonData: string): void {
        const data: LoginActionData = JSON.parse(jsonData);
        const email = data.email;
        const password = data.password;
        const customerAPI = new CustomerAPI(email, password);
        const resultEmail: ValidationResult = Validation.checkEmail(email);
        const resultPassword: ValidationResult = Validation.checkPassword(password);
        if (!resultEmail.isValid) {
            this.emailError = resultEmail.error;
            //this.emit(StoreEventType.LOGIN_ERROR);
        }
        if (!resultPassword.isValid) {
            this.passwordError = resultPassword.error;
        }
        if (resultEmail.isValid && resultPassword.isValid) {
            customerAPI
                .loginCustommer()
                .then(() => {
                    this.routeAction.changePage({ addHistory: true, page: PageName.INDEX });
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
