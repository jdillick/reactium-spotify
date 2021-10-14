import React from 'react';
import op from 'object-path';
import mockTracks from '../mock-tracks';

console.log({mockTracks})

const Track = ({ track = op.get(mockTracks, 'body.tracks.items.0', {}) }) => {
    const id = op.get(track, 'id');
    const images = op.get(track, 'album.images');
    console.log({track, id, images});
    return <div className='track'></div>;
};

export default Track;
