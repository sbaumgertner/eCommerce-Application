import { AppDispatcher } from '../dispatcher';

export abstract class AbstractAction {
    dispatcher: AppDispatcher;

    constructor() {
        this.dispatcher = new AppDispatcher();
    }
}
