import component from '.';
import Reactium from 'reactium-core/sdk';

const loadViewPlayer = async () => {
    await Reactium.Plugin.register('ViewPlayer');

    Reactium.Zone.addComponent({
        zone: 'view-footer',
        component,
    });
};

loadViewPlayer();
