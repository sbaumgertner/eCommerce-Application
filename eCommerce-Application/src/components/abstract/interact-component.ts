import { ElementParams } from '../../types';
import Component from './component';

export default abstract class InteractComponent extends Component {
    constructor(elemParams: ElementParams) {
        super(elemParams);
    }

    public getComponent(): HTMLInputElement {
        return this.componentElem as HTMLInputElement;
    }

    public disable(): void {
        this.getComponent().disabled = true;
    }

    public enable(): void {
        this.getComponent().disabled = false;
    }
}
