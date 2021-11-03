import React from 'react';
import op from 'object-path';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: TrackThumb
 * -----------------------------------------------------------------------------
 */
const TrackThumb = ({ track }) => {
    return (
        <div className='track-thumb'>
            <img
                src={op.get(track, 'album.images.0.url')}
                alt={op.get(track, 'name', '')}
            />
            <div className='track-thumb-name'>
                <h2 className='h5'>{op.get(track, 'name', '')}</h2>
                <h3 className='h6'>{op.get(track, 'album.name', '')}</h3>
            </div>
        </div>
    );
};

export default TrackThumb;
