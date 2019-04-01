import { Action, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const UPDATE_WIDE_LAYOUT = 'UPDATE_WIDE_LAYOUT';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

export interface AppActionUpdatePage extends Action<'UPDATE_PAGE'> {page: string};
export interface AppActionUpdateOffline extends Action<'UPDATE_OFFLINE'> {offline: boolean};
export interface AppActionUpdateDrawerState extends Action<'UPDATE_DRAWER_STATE'> {opened: boolean};
export interface AppActionUpdateLayout extends Action<'UPDATE_WIDE_LAYOUT'> {wideLayout: boolean};
export interface AppActionOpenSnackbar extends Action<'OPEN_SNACKBAR'> {};
export interface AppActionCloseSnackbar extends Action<'CLOSE_SNACKBAR'> {};
export type AppAction = AppActionUpdatePage | AppActionUpdateOffline | AppActionUpdateDrawerState | AppActionOpenSnackbar | AppActionCloseSnackbar | AppActionUpdateLayout;

type ThunkResult = ThunkAction<void, RootState, undefined, AppAction>;

export const navigate: ActionCreator<ThunkResult> = (path: string) => (dispatch) => {
    // Extract the page name from path.
    const page = path === '/' ? 'view1' : path.slice(1);

    // Any other info you might want to extract from the path (like page type),
    // you can do here
    dispatch(loadPage(page));

    // Close the drawer - in case the *path* change came from a link in the drawer.
    dispatch(updateDrawerState(false));
};

const loadPage: ActionCreator<ThunkResult> = (page: string) => (dispatch) => {
    switch(page) {
        case 'view1':
            import('../components/my-view1');
            break;
        case 'view2':
            import('../components/my-view2');
            break;
        case 'view3':
            import('../components/my-view3');
            break;
        default:
            page = 'view404';
            import('../components/my-view404');
    }
    dispatch(updatePage(page));
};

const updatePage: ActionCreator<AppActionUpdatePage> = (page: string) => {
    return { type: UPDATE_PAGE, page };
};

let snackbarTimer: number;

export const showSnackbar: ActionCreator<ThunkResult> = () => (dispatch) => {
    dispatch({ type: OPEN_SNACKBAR });
    window.clearTimeout(snackbarTimer);
    snackbarTimer = window.setTimeout(() => dispatch({ type: CLOSE_SNACKBAR }), 3000);
};

export const updateOffline: ActionCreator<ThunkResult> = (offline: boolean) => (dispatch, getState) => {
    // Show the snackbar only if offline status changes.
    if (offline !== getState().app!.offline) {
        dispatch(showSnackbar());
    }
    dispatch({ type: UPDATE_OFFLINE, offline });
};

export const updateLayout: ActionCreator<ThunkResult> = (wideLayout: boolean) => (dispatch) => {
    dispatch({ type: UPDATE_WIDE_LAYOUT, wideLayout });

    // Open the drawer when we are switching to wide layout and close it when we are
    // switching to narrow.
    dispatch(updateDrawerState(wideLayout));
};

export const updateDrawerState: ActionCreator<AppActionUpdateDrawerState> = (opened: boolean) => {
    return { type: UPDATE_DRAWER_STATE, opened };
};
