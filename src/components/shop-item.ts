import { LitElement, html, property, customElement } from 'lit-element';

// This element is *not* connected to the Redux store.
@customElement('shop-item')
export class ShopItem extends LitElement {
    @property({type: String})
    name = '';

    @property({type: Number})
    amount = 0;

    @property({type: Number})
    price = 0;

    protected render() {
        return html`${this.name}:<span ?hidden="${this.amount === 0}">${this.amount} * </span><span>$${this.price}</span>`;
    }
}