import { UserTypeAction } from '../store/action/userTypeAction';
import { getApiRootForPasswordFlow, myToken } from './client';

export default class CustomerAPI {
    private username: string;
    private password: string;
    private userAction: UserTypeAction = new UserTypeAction();

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async loginCustommer() {
        return getApiRootForPasswordFlow(this.username, this.password)
            .me()
            .login()
            .post({
                body: {
                    email: this.username,
                    password: this.password,
                },
            })
            .execute()
            .then(() => {
                const token = myToken.get().token;
                localStorage.setItem('token', token);
                this.userAction.changeUserType(false);
            });
    }
}
