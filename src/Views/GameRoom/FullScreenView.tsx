import React, {useEffect} from 'react';
import styled from 'styled-components';
import AspectRatio from "./AspectRatio";

const Container = styled.div`
    background: red;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
`;

const FullScreenElement = styled.div`
     width: 100%;
     height: 100%;
`;

interface FullScreenViewProps {
    stream: any;
    subscribe: any;
}
const FullScreenView = (props: FullScreenViewProps) => {
    const { subscribe, stream } = props;

    useEffect(() => {
        subscribe({
            stream,
            element: 'fullscreen'
        })
    }, []);

    return (
        <Container >
            <AspectRatio ratio={16/9}>
                <FullScreenElement id={"fullscreen"} />
            </AspectRatio>
        </Container>
    );
};

export default FullScreenView;
