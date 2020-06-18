# Game Together

GameTogether's mission is to bring people closer together with computer games. It 
allows people to play web based computer games together in group video calls.

[Click here](https://devpost.com/software/gametogether) for a short video introduction.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting started

[Try the development build](https://sheltered-coast-08667.herokuapp.com/).

[Join our trello board](https://trello.com/invite/b/8J31ar6K/de148fc0be6e7bd76c704c623b7c7ad6/mvp).

[Join our Discord server](https://discord.gg/76dHMpH).

Clone the project: `git clone https://github.com/LeonmanRolls/GameTogether.git`.

In order for video calling to work, you will need to create an account with tokbox [here](https://tokbox.com/account/user/signup).
You'll get a free trial which should last for at least a few months of active development, and 
much longer if you're only doing the occasional PR.

After you create a project with opentok you should be able to get your `PROJECT API KEY` and `PROJECT SECRET`.

Copy `.env.example` in the root of the project and rename it to `.env`. Paste in your values.

You will also need to install heroku CLI, instructions [here](https://devcenter.heroku.com/articles/heroku-cli)

In the project folder run `npm i` then `npm run start:dev`, then navigate to [http://localhost:3000](http://localhost:3000).
Note you may end up on localhost:8080 but this will be serving the app currently in the `build` folder.

Please send me your github handle on discord (@Noel), so I can add you to our github organisation.

I am not sure how much documentation people need or want, so please don't hesitate to
ask me (@Noel on discord) any questions or request additions or clarification to 
the documentation. I'm happy to help :). 

## Development process

- Create a new branch named based on the feature you are working on e.g. `video-chat`.
- Once you've made your changes, submit a PR from your branch to master
- After making any requested changes, your PR will be approved and merged!

## Technical overview

The React applicaiton starts in `src/index.tsx`. From here `App.tsx` is loaded.
You can follow the routing from here.

All of the logic for sharing the canvas stream and sharing mouse clicks and 
key presses is handled in `useWebRTCCanvasShare`.

If you would like to get involved with the webRTC code, I strongly recommend
having a good read through [this](https://www.html5rocks.com/en/tutorials/webrtc/basics/).
It covers the history of webRTC, has some nice diagrams and code samples, and is an all
round great in depth introduction.

In GameTogether webRTC is only used for sharing the game's screen and the mouse click
and key presses. Everything related to the video call, that is the camera feed, the audio
feed and screen sharing, is handled by the [Vonage video API](https://tokbox.com/developer/);

We interact with this API mainly through [react-use-opentok](https://github.com/pjchender/react-use-opentok).
You can probably get by with just reading the `react-use-opentok` README.

The basic flow for the game sharing is as follows:

- When 'create game room' is clicked, a uid is generated and added to the url. This
uniquely identifies this room. The name of the game is also added to the url, so
that `GameView` knows which game to load
- The `userWebRTCCanvasShare` hook will then call out to the signaling server 
over websockets. This will create a room with the same id on the `socket.io` server,
which prevents clashes with signalling from other rooms.
- If the user is the first one into the room, they will become the host, and their 
canvas will be streamed to everyone else who joins later. If the user is not the fisrt,
they will become a guest. They will receive the canvas stream and send back their
mouse positions and key presses, which the host will then apply to the game.
- The unique game room id will also be used to create an opentok session.


## Available Scripts

In the project directory, you can run:

### `npm run start:dev`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

### Boring Stuff

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
