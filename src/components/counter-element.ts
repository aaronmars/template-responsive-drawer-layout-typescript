import { LitElement, html, css, customElement, property } from 'lit-element';

// These are the elements needed by this element.
import { plusIcon, minusIcon } from './icons';

// These are the shared styles needed by this element.
import { ButtonSharedStyles } from './button-shared-styles';

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
@customElement('counter-element')
export class CounterElement extends LitElement {
    @property({type: Number})
    clicks = 0;

    @property({type: Number})
    value = 0;

    static get styles() {
        return [
        ButtonSharedStyles,
        css`
            span {
            width: 20px;
            display: inline-block;
            text-align: center;
            font-weight: bold;
            }
        `
        ];
    }

    protected render() {
        return html`
        <div>
            <p>
                Clicked: <span>${this.clicks}</span> times.
                Value is <span>${this.value}</span>.
                <button @click="${this._onIncrement}" title="Add 1">${plusIcon}</button>
                <button @click="${this._onDecrement}" title="Minus 1">${minusIcon}</button>
            </p>
        </div>
        `;
    }

    private _onIncrement() {
        this.value++;
        this.clicks++;
        this.dispatchEvent(new CustomEvent('counter-incremented'));
    }

    private _onDecrement() {
        this.value--;
        this.clicks++;
        this.dispatchEvent(new CustomEvent('counter-decremented'));
  }
}
