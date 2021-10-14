import Element from '.';
import Reactium from 'reactium-core/sdk';

Reactium.Hook.register('plugin-ready', () => {
    // Element Track
    Reactium.Toolkit.Elements.register('track-element', {
        zone: 'spotify-track',
        component: Element,
        order: Reactium.Enums.priority.low,
    });
});
