import React from 'react';
import styled from 'styled-components';

export const GameInfo = [
    {
        name: 'Astray',
        thumbnail: 'https://res.cloudinary.com/teepublic/image/private/s--DW5taYNX--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_jpg,h_630,q_90,w_630/v1485504558/production/designs/1148615_1.jpg',
        description: '',
        link: 'Astray'
    },
    {
        name: 'BitBot',
        thumbnail: 'https://i.pinimg.com/originals/a7/dd/e9/a7dde9fcb917afe2f5a49d086375b5f9.jpg',
        description: '',
        link: 'BitBot'
    },
    {
        name: 'Connect 4',
        thumbnail: 'https://lh3.googleusercontent.com/LH7K1tWy4uEdlqakdEaArKlss2aTi3YqdBC5GwD1sgkD7z5KL4gzAlEDIA-rv0YSNvlT',
        description: '',
        link: 'c4'
    },
    {
        name: 'Drunken Viking',
        thumbnail: 'https://cdn4.vectorstock.com/i/thumb-large/99/88/pixel-art-viking-vector-21479988.jpg',
        description: '',
        link: 'DrunkenViking'
    },
    {
        name: 'Follow me',
        thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR2HnxxgaBjvCKp5SxeY6aSWGHTe-UcHpEWciCel1rxazbQRxOM',
        description: '',
        link: 'follow_me_javascript'
    },
    {
        name: 'Hex 2048',
        thumbnail: 'https://i.pinimg.com/originals/f9/bb/60/f9bb60b1a2d0e84e16b17157eab2380b.png',
        description: '',
        link: 'hex-2048'
    },
    {
        name: 'Hextris',
        thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR1mmxYVAq_jLbpSBP8HazEjeNHMCRfB3jRVdh3roR7weywPoPL',
        description: '',
        link: 'hextris'
    },
    {
        name: 'Infectors',
        thumbnail: 'data:image/png;base64,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',
        description: '',
        link: 'infectors'
    },
    {
        name: 'Obrium',
        thumbnail: 'https://external-preview.redd.it/a2GthoXfizsji8iwS6ca9xeTSOjsBDZ7PppLFQcXDuE.png?auto=webp&s=25086f1d9381350c7ffbcaf9247c6d34beecd28f',
        description: '',
        link: 'obrium'
    },
    {
        name: 'Pacman',
        thumbnail: 'https://i.pinimg.com/236x/ed/41/bf/ed41bfb164e636474b3ec9fd175a410f--perler-patterns-bead-patterns.jpg',
        description: '',
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
