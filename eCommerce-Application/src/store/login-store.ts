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
    private routeAction: RouteAction;

    constructor() {
        super();
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
    }

    private onLogin(jsonData: string): void {
        const data: LoginActionData = JSON.parse(jsonData);
        console.log(data);
        // if (this.validateLogin() && this.apiValidation()) {
        //     this.routeAction.changePage({ addHistory: true, page: PageName.INDEX });
        // }
        //this.emit(StoreEventType.LOGIN);
    }

    protected actionCallback(action: Action): void {
        switch (action.actionType) {
            case ActionType.LOGIN:
                this.onLogin(action.data);
                break;
        }
    }
}
