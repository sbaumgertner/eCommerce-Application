import { AppDispatcher } from '../../dispatcher';

export abstract class Action {
    dispatcher: AppDispatcher;

    constructor() {
        this.dispatcher = new AppDispatcher();
    }
}
