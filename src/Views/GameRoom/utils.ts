type publishFn = (arg0: any) => void;

export const handleTurnOnScreenSharing = (publish: publishFn) => () => {
    publish({
        name: 'screen',
        element: 'me',
        options: {
            width: '300px',
            height: '169px',
            videoSource: 'screen',
        },
    });
};

export const handleTurnOnCamera = (publish: publishFn, setHasVideo: any) => () => {
    setHasVideo(true);
    // publish({
    //     name: 'camera',
    //     element: 'me',
    //     options: {
    //         publishVideo: false,
    //         publishAudio: true,
    //         width: '300px',
    //         height: '169px',
    //     }
    // });
};

export const isVideoEnabled = (publisher: any): boolean => !!publisher.camera;

export const isScreenSharingEnabled = (publisher: any): boolean => !!publisher.screen;

export const isVideoOrScreenEnabled = (publisher: any) => isScreenSharingEnabled(publisher) || isVideoEnabled(publisher);
