import Document from '.';
import Reactium, { __ } from 'reactium-core/sdk';

Reactium.Hook.register('plugin-ready', () => {
    const MenuLink = Reactium.Component.get('RTKMENULINK');

    // Sidebar Link
    Reactium.Toolkit.Sidebar.register('doc', {
        order: Reactium.Enums.priority.highest,
        component: MenuLink,
        children: __('Documentation'),
        'aria-label': __('Documentation'),
        url: '/toolkit',
    });

    // Document
    Reactium.Toolkit.Elements.register('overview', {
        order: 0,
        zone: 'overview',
        component: Document,
    });
});
