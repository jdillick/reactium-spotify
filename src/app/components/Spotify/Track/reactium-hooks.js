import Reactium from 'reactium-core/sdk';
import Track from './index';

const plugin = async () => {
    await Reactium.Plugin.register('track');
    Reactium.Component.register('Track', Track);
};

plugin();
