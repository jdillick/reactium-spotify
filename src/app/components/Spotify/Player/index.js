import React, { useEffect } from 'react';
import { useSelectHandle, cxFactory, __ } from 'reactium-core/sdk';
import op from 'object-path';
import { Feather } from 'components/common-ui/Icon';
import dayjs from 'dayjs';

if (!dayjs.duration) {
    const duration = require('dayjs/plugin/duration');
    dayjs.extend(duration);
}

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Player
 * -----------------------------------------------------------------------------
 */

const Player = ({
    onBack = track => console.log('back'),
    onPause = track => console.log('pause', { track }),
    onResume = track => console.log('resume', { track }),
    onForward = track => console.log('forward'),
    onPositionChange = value => console.log('position', { value }),
    onVolumeChange = value => console.log('volume', { value }),
    hasNextTrack = false,
    onViewQueue = () => console.log('view queue'),
}) => {
    const {
        handle,
        selected: { track, status },
    } = useSelectHandle(
        'SpotifyDemo',
        state => ({
            track: state.get('track', {}),
            status: state.get('status', { paused: true, position: 0 }),
        }),
        {},
    );

    const cn = cxFactory('player');
    const trackDuration = dayjs.duration(op.get(track, 'duration_ms', 0));
    const position = op.get(status, 'position', 0);
    const positionDuration = dayjs.duration(position);
    const dString = duration => {
        const mins = duration.minutes() || 0;
        const secs = duration.seconds() || 0;
        return `${mins < 10 ? `0${mins}` : mins}:${
            secs < 10 ? `0${secs}` : secs
        }`;
    };
    const paused = op.get(status, 'paused', true);

    useEffect(() => {
        if (!handle.get('status.paused', true)) {
            const to = setTimeout(() => {
                handle.setPosition(
                    Math.min(
                        handle.get('status.position', 0) + 500,
                        handle.get('track.duration_ms', 0),
                    ),
                );
            }, 500);
            return () => clearTimeout(to);
        }
    }, [op.get(track, 'id'), handle.get('status.position')]);

    const controls = {
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

    const playButton = controls[paused ? 'resume' : 'pause'];

    return (
        <>
            {track && (
                <section className={cn()}>
                    <div className={cn('details')}>
                        <div className={cn('art')}>
                            <img
                                src={op.get(track, 'album.images.0.url', '')}
                                alt={op.get(track, 'name', '')}
                            />
                        </div>
                        <div className={cn('playing')}>
                            <h2 className='h3'>{op.get(track, 'name', '')}</h2>
                            <h3 className='h4'>
                                {op.get(track, 'album.name', '')}
                            </h3>
                        </div>
                    </div>
                    <div className={cn('controls')}>
                        <div className={cn('track-controls')}>
                            <button
                                className='btn-icon btn-player'
                                onClick={onBack}>
                                <Feather.SkipBack />
                            </button>
                            <button
                                className='btn-icon btn-player'
                                onClick={() => playButton.onClick(track)}>
                                <span className='sr-only'>
                                    {playButton.text}
                                </span>
                                <playButton.Icon />
                            </button>
                            <button
                                className='btn-icon btn-player'
                                onClick={onForward}
                                disabled={!hasNextTrack}>
                                <Feather.SkipForward />
                            </button>
                        </div>

                        <div className={cn('progress')}>
                            <span className='sr-only' htmlFor='player-position'>
                                {__('Player position')}
                            </span>
                            <div className='track-position'>
                                {dString(positionDuration)}
                            </div>
                            <input
                                id={'player-position'}
                                type='range'
                                min={0}
                                max={track.duration_ms}
                                value={position}
                                onChange={({ target }) =>
                                    onPositionChange(target.value)
                                }
                            />
                            <div className='track-position'>
                                {dString(trackDuration)}
                            </div>
                        </div>
                    </div>

                    <div className={cn('volume')}>
                        <span className='sr-only' htmlFor='volume'>
                            {__('Volume control at %s percent').replace(
                                '%s',
                                Math.floor(handle.get('volume', 0) * 100),
                            )}
                        </span>
                        <div className={cn('volume-input')}>
                            <div className='volume-icon'>
                                <Feather.Volume />
                            </div>
                            <input
                                id={'volume'}
                                type='range'
                                min={0}
                                max={1.0}
                                step={0.01}
                                value={handle.get('volume', 0.5)}
                                onChange={({ target }) =>
                                    onVolumeChange(target.value)
                                }
                            />
                            <div className='volume-icon'>
                                <Feather.Volume2 />
                            </div>
                        </div>
                    </div>
                    <button
                        className='btn-icon btn-view-queue'
                        onClick={onViewQueue}
                        disabled={!hasNextTrack}>
                        <Feather.List />
                    </button>
                </section>
            )}
        </>
    );
};

export default Player;
