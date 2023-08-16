import { getApiRootForPasswordFlow } from './client';

export default class CustomerAPI {
    private username: string;
    private password: string;

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
            .execute();
    }
}
