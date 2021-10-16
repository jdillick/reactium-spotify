import React from 'react';
import op from 'object-path';
import mockTracks from '../mock-tracks';
import { Feather } from 'components/common-ui/Icon';
import { __, useSyncState } from 'reactium-core/sdk';

const control = ({ cb }) => async track => {
    try {
        await cb(track);
    } catch (error) {
        console.error(error);
    }
};

const Track = ({
    track = op.get(mockTracks, 'body.tracks.items.0', {}),
    onPlay = track => console.log('play', { track }),
    onPause = track => console.log('pause', { track }),
    onResume = track => console.log('resume', { track }),
    status = 'stopped',
}) => {
    const uri = op.get(track, 'uri');
    const album = op.get(track, 'album', {});
    const image = op.get(album, 'images.0');
    const artists = op.get(album, 'artists', []);

    const controls = {
        play: {
            text: __('Play %s').replace('%s', op.get(track, 'name')),
            Icon: Feather.Play,
            onClick: onPlay,
        },
        resume: {
            text: __('Resume %s').replace('%s', op.get(track, 'name')),
            Icon: Feather.Play,
            onClick: onResume,
        },
        pause: {
            text: __('Pause'),
            Icon: Feather.Pause,
            onClick: onPause,
        },
    };

    let Control = controls.play;
    if (status === 'playing') Control = controls.pause;
    if (status === 'paused') Control = controls.resume;

    return (
        <article className='track'>
            <div className='track-bg'>
                {image && <img src={image.url} alt={op.get(track, 'name')} />}
            </div>
            <div className='track-body'>
                <div className='track-control'>
                    <div className='track-image'>
                        {image && (
                            <img src={image.url} alt={op.get(track, 'name')} />
                        )}
                    </div>

                    <div className='track-details'>
                        <h2>{op.get(track, 'name')}</h2>
                        <h3 className='h4'>{op.get(album, 'name')}</h3>

                        <label className='sr-only' htmlFor='artists'>
                            {__('Artists')}
                        </label>
                        <ul id='artists' className='artists-list'>
                            {artists.map(artist => (
                                <li className={'artist'} key={artist.name}>
                                    {artist.name}
                                </li>
                            ))}
                        </ul>
                        <button
                            className='pause-play btn-icon'
                            onClick={() =>
                                control({
                                    cb: Control.onClick,
                                })(track)
                            }>
                            <Control.Icon />
                            <span className='sr-only'>{Control.text}</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default Track;
