import React from 'react';
import { __, useHookComponent } from 'reactium-core/sdk';
import mockTracks from 'components/Spotify/mock-tracks';
import op from 'object-path';

export default () => {
    const { Element } = useHookComponent('RTK');
    const TrackThumb = useHookComponent('TrackThumb');

    return (
        <Element title={__('Track Thumb')}>
            <div className='m-20'>
                <TrackThumb
                    track={op.get(mockTracks, 'body.tracks.items.10', {})}
                />
            </div>
        </Element>
    );
};
