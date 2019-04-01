import { LitElement, html, css, property, customElement } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin';

// This element is connected to the Redux store.
import { store, RootState } from '../store';

// These are the elements needed by this element.
import { removeFromCartIcon } from './icons';
import './shop-item';

// These are the actions needed by this element.
import { removeFromCart } from '../actions/shop';

// These are the reducers needed by this element.
import { cartItemsSelector, cartTotalSelector } from '../reducers/shop';

// These are the shared styles needed by this element.
import { ButtonSharedStyles } from './button-shared-styles';
import { CartItem } from '../reducers/shop';

@customElement('shop-cart')
export class ShopCart extends connect(store)(LitElement) {
    @property({type: Array})
    private _items: Array<CartItem> = [];

    @property({type: Number})
    private _total = 0;

    static get styles() {
        return [
        ButtonSharedStyles,
        css`
            :host {
                display: block;
            }
        `
        ];
    }

    protected render() {
        return html`
            <p ?hidden="${this._items.length !== 0}">Please add some products to cart.</p>
            ${this._items.map((item) =>
                html`
                    <div>
                        <shop-item .name="${item.title}" .amount="${item.amount}" .price="${item.price}"></shop-item>
                        <button @click="${this._removeButtonClicked}" data-index="${item.id}" title="Remove from cart">
                            ${removeFromCartIcon}
                        </button>
                    </div>
                `
            )}
            <p ?hidden="${!this._items.length}"><b>Total:</b> ${this._total}</p>
        `;
    }


    private _removeButtonClicked(e: Event) {
        store.dispatch(removeFromCart((e.currentTarget as HTMLButtonElement).dataset['index']));
    }

    // This is called every time something is updated in the store.
    stateChanged(state: RootState) {
        this._items = cartItemsSelector(state);
        this._total = cartTotalSelector(state);
    }
}