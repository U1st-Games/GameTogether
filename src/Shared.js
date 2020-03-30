import React from 'react';
import styled from 'styled-components';

export const GameInfo = [
    {
        name: 'Astray',
        thumbnail: 'https://via.placeholder.com/1000',
        description: 'description',
        link: 'Astray'
    },
    {
        name: 'BitBot',
        thumbnail: 'https://via.placeholder.com/1000',
        description: 'description',
        link: 'BitBot'
    },
    {
        name: 'Connect 4',
        thumbnail: 'https://via.placeholder.com/1000',
        description: 'description',
        link: 'c4'
    },
    {
        name: 'Drunken Viking',
        thumbnail: 'https://via.placeholder.com/1000',
        description: 'description',
        link: 'DrunkenViking'
    },
    {
        name: 'Follow me',
        thumbnail: 'https://via.placeholder.com/1000',
        description: 'description',
        link: 'follow_me_javascript'
    },
    {
        name: 'Hex 2048',
        thumbnail: 'https://via.placeholder.com/1000',
        description: 'description',
        link: 'hex-2048'
    },
    {
        name: 'Hextris',
        thumbnail: 'https://via.placeholder.com/1000',
        description: 'description',
        link: 'hextris'
    },
    {
        name: 'Infectors',
        thumbnail: 'https://via.placeholder.com/1000',
        description: 'description',
        link: 'infectors'
    },
    {
        name: 'Obrium',
        thumbnail: 'https://via.placeholder.com/1000',
        description: 'description',
        link: 'obrium'
    },
    {
        name: 'Pacman',
        thumbnail: 'https://via.placeholder.com/1000',
        description: 'description',
        link: 'pacman-canvas'
    },
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
