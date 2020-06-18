// File where all analytics processes will happen
import ReactGA from 'react-ga';

const trackingID = "INSERT_TRACKING_NUMBER"; //TODO: Tracking ID needs to be added here

export function fireEvent(eventName, action) { //Fires an event to google analytics 
    ReactGA.initialize(trackingID);
    ReactGA.event({
        category: eventName,
        action: action,
    })
}