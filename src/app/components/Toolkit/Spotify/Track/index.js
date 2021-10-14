import React from 'react';
import Reactium, { __, useHookComponent } from 'reactium-core/sdk';

export default () => {
    const { Element } = useHookComponent('RTK');
    const Track = useHookComponent('Track');

    return <Element title={__('Track')} className='pt-xs-64 px-xs-40'><Track onPlay={track => Reactium.Spotify.api.play({ uris: [track.uri]}) } onPause={() => Reactium.Spotify.player.pause() } /></Element>;
};
