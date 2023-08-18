<<<<<<< HEAD
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
=======
import { RouteAction } from './action/routeAction';
import { LoginAction } from './action/loginAction';
import { Action, ActionType, StoreEventType } from '../types';
import { Store } from './abstract/store';
import { LoginActionData } from './action/loginAction';
import { isValidEmail } from '../utils/input-validation';
import CustomerAPI from '../api/customerAPI';

export class LoginStore extends Store {
    private loginAction: LoginAction;
    private customerAPI: CustomerAPI;
>>>>>>> b727df6 (feat: add login-store)
    private routeAction: RouteAction;

    constructor() {
        super();
<<<<<<< HEAD
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
=======
        this.loginAction = new LoginAction();
        this.customerAPI = new CustomerAPI('email', 'password');
        this.routeAction = new RouteAction();
    }

    private getUserData(): LoginActionData {
        const email = (document.querySelector('.email') as HTMLInputElement).value.trim();
        const password = (document.querySelector('.password') as HTMLInputElement).value.trim();
        const userData = {
            email: email,
            password: password,
        };

        return userData;
        // const state = {
        //     is_authenticated: false,
        //     login_data: {
        //         email: email.value,
        //         password: password.value,
        //     },
        // };
    }

    private validateLogin(): boolean {
        const email = (document.querySelector('.email') as HTMLInputElement).value.trim();
        if (email === '') {
            //setError(email, 'Email is required');
            return false;
        } else if (!isValidEmail(email)) {
            //setError(email, 'Provide a valid email address');
            return false;
        } else {
            //setSuccess(email);
            return true;
        }
    }

    private apiValidation(): boolean {
        this.customerAPI.loginCustommer();
        return true;
>>>>>>> b727df6 (feat: add login-store)
    }

    private onLogin(jsonData: string): void {
        const data: LoginActionData = JSON.parse(jsonData);
<<<<<<< HEAD
        const email = data.email;
        const password = data.password;
        const customerAPI = new CustomerAPI(email, password);
        const resultEmail: ValidationResult = Validation.checkEmail(email);
        const resultPassword: ValidationResult = Validation.checkPassword(password);
        if (!resultEmail.isValid) {
            this.emailError = resultEmail.error;
            this.emit(StoreEventType.LOGIN_ERROR);
        } else if (!resultPassword.isValid) {
            this.passwordError = resultPassword.error;
            this.emit(StoreEventType.LOGIN_ERROR);
        }

        if (resultEmail.isValid && resultEmail.isValid) {
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
=======
        console.log(data);
        // if (this.validateLogin() && this.apiValidation()) {
        //     this.routeAction.changePage({ addHistory: true, page: PageName.INDEX });
        // }
        //this.emit(StoreEventType.LOGIN);
>>>>>>> b727df6 (feat: add login-store)
    }

    protected actionCallback(action: Action): void {
        switch (action.actionType) {
            case ActionType.LOGIN:
                this.onLogin(action.data);
                break;
        }
    }
}
