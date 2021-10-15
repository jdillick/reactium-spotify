import React from 'react';
import op from 'object-path';
import mockTracks from '../mock-tracks';
import { Feather } from 'components/common-ui/Icon';
import Reactium, { __ } from 'reactium-core/sdk';

console.log({ mockTracks });

const Track = ({
    track = op.get(mockTracks, 'body.tracks.items.0', {}),
    playing = false,
    onPlay = track => console.log('play', { track }),
    onPause = track => console.log('pause', { track }),
}) => {
    const uri = op.get(track, 'uri');
    const images = op.get(track, 'album.images', []);
    const image = op.get(images, '0');
    const artists = (track, 'album.artists', []);
    console.log({ track, uri, images });

    const controls = {
        play: {
            text: __('Play'),
            Icon: Feather.Play,
            onClick: onPlay,
        },
        pause: {
            text: __('Pause'),
            Icon: Feather.Pause,
            onClick: onPause,
        },
    };

    const Control = playing ? controls.pause : controls.play;

    return (
        <section className='track'>
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
                        <label htmlFor='artists'>{__('Artists')}</label>
                        <ul id='artists' className='artists-list'>
                            {op.get(artists).map(artist => (
                                <li className={'artist'} key={artist.name}>
                                    {artist.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        className='pause-play btn-icon'
                        onClick={() => Control.onClick(track)}>
                        <Control.Icon />
                        <span className='sr-only'>{Control.text}</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Track;
