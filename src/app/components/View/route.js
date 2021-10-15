import View from './index';

export default [
    {
        path: ['/'],
        exact: true,
        component: View,
        zone: 'main',
    },
    {
        path: ['/playlist/:playlistId'],
        exact: true,
        component: View,
        zone: 'playlist',
    }
];
