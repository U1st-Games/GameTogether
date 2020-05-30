type publishFn = (arg0: any) => void;

export const handleTurnOnScreenSharing = (publish: publishFn) => () => {
    publish({
        name: 'screen',
        element: 'me',
        options: {
            insertMode: 'replace',
            width: '300px',
            height: '169px',
            videoSource: 'screen',
        },
    });
};

export const handleTurnOnCamera = (publish: publishFn) => () => {
    publish({
        name: 'camera',
        element: 'me',
        options: {
            insertMode: 'replace',
            width: '300px',
            height: '169px',
        }
    });
};
