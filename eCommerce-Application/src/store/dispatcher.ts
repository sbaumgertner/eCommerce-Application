import { Dispatcher } from 'flux';
import { Action } from '../types';

export class AppDispatcher {
    private dispatcher?: Dispatcher<Action>;
    private static instance: AppDispatcher;

    constructor() {
        if (AppDispatcher.instance) {
            return AppDispatcher.instance;
        }
        this.dispatcher = new Dispatcher<Action>();
        AppDispatcher.instance = this;
    }

    public handleAction(action: Action): void {
        this.dispatcher?.dispatch(action);
    }

    public registerOnAction(callback: (action: Action) => void): void {
        this.dispatcher?.register(callback);
    }
}
