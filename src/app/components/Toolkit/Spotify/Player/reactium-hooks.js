import Element from '.';
import Reactium, { __ } from 'reactium-core/sdk';

Reactium.Hook.register('plugin-ready', () => {
    const MenuLink = Reactium.Component.get('RTKMENULINK');

    // Sidebar Item: Player
    Reactium.Toolkit.Sidebar.register('player', {
        order: 100,
        component: MenuLink,
        children: __('Player'),
        'aria-label': __('Player'),
        url: '/toolkit/spotify/player',
        group: 'spotify',
    });

    // Element Playerelement
    Reactium.Toolkit.Elements.register('player-element', {
        zone: 'spotify-player',
        component: Element,
        order: Reactium.Enums.priority.low,
    });
});
