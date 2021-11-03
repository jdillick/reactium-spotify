import Element from '.';
import Reactium, { __ } from 'reactium-core/sdk';

Reactium.Hook.register('plugin-ready', () => {
    const MenuLink = Reactium.Component.get('RTKMENULINK');

    // Sidebar Item: Thumb
    Reactium.Toolkit.Sidebar.register('trackthumb', {
        order: 100,
        component: MenuLink,
        children: __('Thumb'),
        'aria-label': __('Thumb'),
        url: '/toolkit/spotify/trackthumb',
        group: 'spotify',
    });

    // Element Trackthumb
    Reactium.Toolkit.Elements.register('trackthumb-element', {
        zone: 'spotify-trackthumb',
        component: Element,
        order: Reactium.Enums.priority.low,
    });
});
