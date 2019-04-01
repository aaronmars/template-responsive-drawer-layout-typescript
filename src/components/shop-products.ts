import { LitElement, html, css, property, customElement } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin';

// This element is connected to the Redux store.
import { store, RootState } from '../store';

// These are the elements needed by this element.
import './shop-item';

// These are the actions needed by this element.
import { getAllProducts, addToCart } from '../actions/shop';

// These are the elements needed by this element.
import { addToCartIcon } from './icons';

// These are the shared styles needed by this element.
import { ButtonSharedStyles } from './button-shared-styles';
import { ProductsState } from '../reducers/shop';

@customElement('shop-products')
export class ShopProducts extends connect(store)(LitElement) {
    @property({type: Object})
    private _products: ProductsState = {};

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
            ${Object.keys(this._products).map((key) => {
                const item = this._products[key];
                return html`
                    <div>
                        <shop-item name="${item.title}" amount="${item.inventory}" price="${item.price}"></shop-item>
                        <button .disabled="${item.inventory === 0}" @click="${this._addButtonClicked}" data-index="${item.id}" title="${item.inventory === 0 ? 'Sold out' : 'Add to cart' }">
                            ${item.inventory === 0 ? 'Sold out': addToCartIcon }
                        </button>
                    </div>
                `;
            })}
        `;
    }

    protected firstUpdated() {
        store.dispatch(getAllProducts());
    }

    private _addButtonClicked(e: Event) {
        store.dispatch(addToCart((e.currentTarget as HTMLButtonElement).dataset['index']));
    }

    // This is called every time something is updated in the store.
    stateChanged(state: RootState) {
        this._products = state.shop!.products;
    }
}
