/*
GameTogether © Copyright, Nang Development Limited 2020. All Rights Reserved.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react';
import styled from 'styled-components';

interface IGameInfo {
	name: string,
	thumbnail: string,
	description: string,
	link: string,
    canvasId: string
}

export const GameInfo: IGameInfo[] = [
    {
        name: 'Pacman',
        thumbnail: 'https://i.pinimg.com/236x/ed/41/bf/ed41bfb164e636474b3ec9fd175a410f--perler-patterns-bead-patterns.jpg',
        description: '',
        link: 'pacman',
        canvasId: 'myCanvas'
    }
];

export const getCanvasIdByLink = (gameInfo: IGameInfo[], link: string) =>
    gameInfo.find(x => x.link === link)?.canvasId;

export const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(100% - 64px);
    padding: 20px;
    box-sizing: border-box;
    text-align: center;
`;
