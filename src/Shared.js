/*
GameTogether © Copyright, Nang Development Limited 2020. All Rights Reserved.
The authors, being Leon Talbert have asserted their moral rights.
 */

import React from 'react';
import styled from 'styled-components';

export const GameInfo = [
    {
        name: 'Pacman',
        thumbnail: 'https://i.pinimg.com/236x/ed/41/bf/ed41bfb164e636474b3ec9fd175a410f--perler-patterns-bead-patterns.jpg',
        description: '',
        link: 'pacman-canvas'
    }
];

export const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(100% - 64px);
    padding: 20px;
    box-sizing: border-box;
    text-align: center;
    overflow-y: auto;
`;
