import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import {
    cxFactory,
    useRegisterSyncHandle,
    useIsContainer,
    useEventEffect,
    useScrollToggle,
} from 'reactium-core/sdk';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Modal
 * -----------------------------------------------------------------------------
 */
const Modal = () => {
    const bodyScroll = useScrollToggle();
    const handle = useRegisterSyncHandle('Modal', {
        open: false,
        Contents: {
            Component: () => null,
        },
    });
    handle.extend('close', () => {
        handle.set('open', false);
        bodyScroll.enable();
    });
    handle.extend('open', Component => {
        handle.set('Contents', { Component });
        handle.set('open', true);
        bodyScroll.disable();
    });

    const isContainer = useIsContainer();
    const container = useRef();
    const content = useRef();
    const dismiss = e => {
        if (
            isContainer(e.target, container.current) &&
            !isContainer(e.target, content.current)
        ) {
            handle.close();
        }
    };

    useEventEffect(
        window,
        {
            mousedown: dismiss,
            touchstart: dismiss,
        },
        [container.current],
    );

    const cn = cxFactory('modal');
    const Component = handle.get('Contents.Component', () => null);

    return ReactDOM.createPortal(
        <div
            ref={container}
            className={`${cn()} ${cn({ open: handle.get('open', false) })}`}>
            <div ref={content} className={cn('contents')}>
                <Component modal={handle} />
            </div>
        </div>,
        document.querySelector('body'),
    );
};

export default Modal;
