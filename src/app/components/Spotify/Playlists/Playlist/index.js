import React, { forwardRef } from 'react';
import op from 'object-path';
import mockPlaylist from '../../mock-pl';
import { Link } from 'react-router-dom';

const Playlist = forwardRef(({ playlist = mockPlaylist }, ref) => {
    const [image] = op.get(playlist, 'images', []);

    return (
        <Link className='playlist-link' to={`/playlist/${playlist.id}`} ref={ref}>
            <h2 className='sr-only'>{op.get(playlist, 'name')}</h2>
            {image && <img src={image.url} alt={op.get(playlist, 'description', '')} />}
        </Link>
    );
});

export default Playlist;
