import { EventEmitter } from 'events';
import { Action, StoreEventType } from '../../types';
import { AppDispatcher } from '../dispatcher';

export abstract class Store extends EventEmitter {
    protected dispatcher: AppDispatcher;

    constructor() {
        super();
        this.dispatcher = new AppDispatcher();
        this.dispatcher.registerOnAction(this.actionCallback.bind(this));
    }

    protected emitChange(event: StoreEventType): void {
        this.emit(event);
    }

    public addChangeListener(event: StoreEventType, callback: () => void): void {
        this.on(event, callback);
    }

    public removeChangeListener(event: StoreEventType, callback: () => void): void {
        this.on(event, callback);
    }

    protected abstract actionCallback(action: Action): void;
}
