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
import ReactGA from 'react-ga';
import React from 'react';
import styled from 'styled-components';
import {
    useHistory,
} from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { Container, GameInfo } from '../Shared';

const HomeContainer = styled(Container)`
    flex-wrap: wrap;
`;

const useStyles = makeStyles({
    root: {
        width: 345,
        marginRight: 20,
        marginBottom: 20
    },
});

function fireEvent(eventName) { //Fires an event to google analytics
    console.log("EVENT: "+eventName);
    const trackingID = "INSERT_TRACKING_NUMBER"; //Tracking ID needs to be added here
    ReactGA.initialize(trackingID);
    ReactGA.event({
        category: eventName,
        action: "User did something",
    })
}

const GameCard = ({ name, thumbnail, description, link, roomid }) => {
    const classes = useStyles();
    const history = useHistory();
    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt="Contemplative Reptile"
                    height="345"
                    image={thumbnail}
                    title={name}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button
                    size="small"
                    color="primary"
                    variant={"contained"}
                    onClick={() => {
                        fireEvent("User created new game")
                        history.push(`/${roomid || uuidv4()}/${link}`)

                    }}
                    style={{ margin: '0 auto', backgroundColor: 'black' }}
                >
                    Create game room
                </Button>
            </CardActions>
        </Card>
    );
};

const Home = ({ roomid }) => {
    console.log('home rendeerd');
    return (
        <HomeContainer>
            {GameInfo.map((gameinfo) => {
                return <GameCard {...{ ...gameinfo, roomid }} />
            })}
        </HomeContainer>
    );
};

export default Home;
