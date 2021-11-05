import Reactium, { __ } from 'reactium-core/sdk';

Reactium.Hook.register('plugin-ready', () => {
    const MenuLink = Reactium.Component.get('RTKMENULINK');

    // Sidebar Item: Track
    Reactium.Toolkit.Sidebar.register('track', {
        order: 100,
        component: MenuLink,
        children: __('Track'),
        'aria-label': __('Track'),
        url: '/toolkit/spotify/track',
        group: 'spotify',
    });

    // Sidebar Item: Spotify Components
    Reactium.Toolkit.Sidebar.register('spotify', {
        order: 100,
        component: MenuLink,
        children: __('Spotify Components'),
        'aria-label': __('Spotify Components'),
    });
});
