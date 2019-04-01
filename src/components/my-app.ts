import { LitElement, html, css, property, PropertyValues, customElement } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';
import { connect } from 'pwa-helpers/connect-mixin';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query';
import { installOfflineWatcher } from 'pwa-helpers/network';
import { installRouter } from 'pwa-helpers/router';
import { updateMetadata } from 'pwa-helpers/metadata';

// This element is connected to the Redux store.
import { store, RootState } from '../store';

// These are the actions needed by this element.
import { navigate, updateOffline, updateDrawerState, updateLayout } from '../actions/app';

// The following line imports the type only - it will be removed by tsc so
// another import for app-drawer.js is required below.
import { AppDrawerElement } from '@polymer/app-layout/app-drawer/app-drawer';

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import { menuIcon } from './icons';
import './snack-bar';

@customElement('my-app')
export class MyApp extends connect(store)(LitElement) {
    @property({type: String})
    appTitle = '';

    @property({type: String})
    private _page = '';

    @property({type: Boolean})
    private _drawerOpened = false;

    @property({type: Boolean})
    private _snackbarOpened = false;

    @property({type: Boolean})
    private _offline = false;

    @property({type: Boolean})
    private _wideLayout = true;

    static get styles() {
        return [
          css`
            :host {
              --app-drawer-width: 256px;
              display: block;
    
              --app-primary-color: #E91E63;
              --app-secondary-color: #293237;
              --app-dark-text-color: var(--app-secondary-color);
              --app-light-text-color: white;
              --app-section-even-color: #f7f7f7;
              --app-section-odd-color: white;
    
              --app-header-background-color: white;
              --app-header-text-color: var(--app-dark-text-color);
              --app-header-selected-color: var(--app-primary-color);
    
              --app-drawer-background-color: var(--app-secondary-color);
              --app-drawer-text-color: var(--app-light-text-color);
              --app-drawer-selected-color: #78909C;
            }
    
            app-header {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              text-align: center;
              background-color: var(--app-header-background-color);
              color: var(--app-header-text-color);
              border-bottom: 1px solid #eee;
            }
    
            .toolbar-top {
              background-color: var(--app-header-background-color);
            }
    
            [main-title] {
              font-family: 'Pacifico';
              text-transform: lowercase;
              font-size: 30px;
              margin-right: 44px;
            }
    
            .menu-btn {
              background: none;
              border: none;
              fill: var(--app-header-text-color);
              cursor: pointer;
              height: 44px;
              width: 44px;
            }
    
            .drawer-list {
              box-sizing: border-box;
              width: 100%;
              height: 100%;
              padding: 24px;
              background: var(--app-drawer-background-color);
              position: relative;
            }
    
            .drawer-list > a {
              display: block;
              text-decoration: none;
              color: var(--app-drawer-text-color);
              line-height: 40px;
              padding: 0 24px;
            }
    
            .drawer-list > a[selected] {
              color: var(--app-drawer-selected-color);
            }
    
            /* Workaround for IE11 displaying <main> as inline */
            main {
              display: block;
            }
    
            .main-content {
              padding-top: 64px;
              min-height: 100vh;
            }
    
            .page {
              display: none;
            }
    
            .page[active] {
              display: block;
            }
    
            footer {
              padding: 24px;
              background: var(--app-drawer-background-color);
              color: var(--app-drawer-text-color);
              text-align: center;
            }
    
            /* Wide layout */
            @media (min-width: 768px) {
              app-header,
              .main-content,
              footer {
                margin-left: var(--app-drawer-width);
              }
              .menu-btn {
                display: none;
              }
    
              [main-title] {
                margin-right: 0;
              }
            }
          `
        ];
    }

    protected render() {
        return html`
            <!-- Header -->
            <app-header condenses reveals effects="waterfall">
                <app-toolbar class="toolbar-top">
                    <button class="menu-btn" title="Menu" @click="${this._menuButtonClicked}">${menuIcon}</button>
                    <div main-title>${this.appTitle}</div>
                </app-toolbar>
            </app-header>

            <!-- Drawer content -->
            <app-drawer .opened="${this._drawerOpened}" .persistent="${this._wideLayout}"
                @opened-changed="${this._drawerOpenedChanged}">
                <nav class="drawer-list">
                    <a ?selected="${this._page === 'view1'}" href="/view1">View One</a>
                    <a ?selected="${this._page === 'view2'}" href="/view2">View Two</a>
                    <a ?selected="${this._page === 'view3'}" href="/view3">View Three</a>
                </nav>
            </app-drawer>

            <!-- Main content -->
            <main role="main" class="main-content">
                <my-view1 class="page" ?active="${this._page === 'view1'}"></my-view1>
                <my-view2 class="page" ?active="${this._page === 'view2'}"></my-view2>
                <my-view3 class="page" ?active="${this._page === 'view3'}"></my-view3>
                <my-view404 class="page" ?active="${this._page === 'view404'}"></my-view404>
            </main>

            <footer>
                <p>Made with &hearts; by the Polymer team.</p>
            </footer>

            <snack-bar ?active="${this._snackbarOpened}">
                You are now ${this._offline ? 'offline' : 'online'}.
            </snack-bar>
        `;
    }

    constructor() {
        super();
        // To force all event listeners for gestures to be passive.
        // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
        setPassiveTouchGestures(true);
    }

    protected firstUpdated() {
        installRouter((location) => store.dispatch(navigate(decodeURIComponent(location.pathname))));
        installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
        installMediaQueryWatcher(`(min-width: 768px)`, (matches) => store.dispatch(updateLayout(matches)));
    }

    protected updated(changedProps: PropertyValues) {
        if (changedProps.has('_page')) {
            const pageTitle = this.appTitle + ' - ' + this._page;
            updateMetadata({
                title: pageTitle,
                description: pageTitle
                // This object also takes an image property, that points to an img src.
            });
        }
    }

    private _menuButtonClicked() {
        store.dispatch(updateDrawerState(true));
    }

    private _drawerOpenedChanged(e: Event) {
        store.dispatch(updateDrawerState((e.target as AppDrawerElement).opened));
    }

    stateChanged(state: RootState) {
        this._page = state.app!.page;
        this._offline = state.app!.offline;
        this._snackbarOpened = state.app!.snackbarOpened;
        this._drawerOpened = state.app!.drawerOpened;
        this._wideLayout = state.app!.wideLayout;
    }
}