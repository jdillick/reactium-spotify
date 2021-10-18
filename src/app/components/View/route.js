import View from './index';

const transitionStates = [
    { state: 'EXITING', active: 'previous' },
    { state: 'LOADING', active: 'current' },
    { state: 'ENTERING', active: 'current' },
    { state: 'READY', active: 'current' },
];

export default [
    {
        path: ['/'],
        component: View,
        zone: 'main',
    },
    {
        path: ['/playlist/:playlistId'],
        component: View,
        zone: 'playlist',
    },
].map(r => ({ ...r, exact: true, transitions: true, transitionStates }));
