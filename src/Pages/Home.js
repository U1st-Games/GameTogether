import React from 'react';
import styled from 'styled-components';
import {
    useHistory,
} from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { Container, GameInfo } from '../Shared';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
});

const GameCard = ({ name, thumbnail, description, link }) => {
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
                    onClick={() => history.push(`/gameroom/${link}`)}
                >
                    Create game room
                </Button>
            </CardActions>
        </Card>
    );
};

const Home = () => {
    return (
        <Container>
            {GameInfo.map(GameCard)}
        </Container>
    );
};

export default Home;
