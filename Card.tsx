import { useState, useEffect } from 'react';
import { type PropsWithChildren } from 'react';

import './styles/Card.css';

interface props_Card {
    img?: string,
    dimensions?: {
        width: number,
        height: number,
        units: "mm" | "px" | "rem" | "%"
    }
    position?: {
        x: number,
        y: number
    }
}

function Card({img = undefined, dimensions = {width: 63, height: 88, units: "mm"}, position = {x: 0, y: 0}, children = undefined}: PropsWithChildren<props_Card>)
{
    // Object which holds all the data for the style attribute of this element
    type CardStyle = {
        top: number,
        left: number,
        transform?: string, 
        width?: string,
        height?: string
    }
    const [cardStyle, setCardStyle] = useState<CardStyle>({top: position.y, left: position.x});

    // Variables for tracking which part of the card the user grabbed
    let offsetX: number = 0;
    let offsetY: number = 0;

    // Variables for tracking card movement speed
    let lastPosX: number = 0;
    let lastPosY: number = 0;
    let speedX: number = 0;
    let speedY: number = 0;

    // Variable for tracking card angle in 3d space
    let tilt: number = 0;
    const tiltAmplifier: number = 2;
    const tiltMax: number = 45;

    // Add user-defined styles to cardStyle
    useEffect(() => {
        if (dimensions)
        {
            setCardStyle({...cardStyle, 
                width: dimensions.width.toString() + dimensions.units,
                height: dimensions.height.toString() + dimensions.units
            })
        }
    }, [])

    // Grab the card with the cursor
    const grabCard = (e: React.MouseEvent) => {
        e.preventDefault();

        // Track the part of the card clicked
        offsetX = e.clientX - cardStyle.left;
        offsetY = e.clientY - cardStyle.top;

        // Set speed-tracking variables 
        lastPosX = e.clientX - offsetX;
        lastPosY = e.clientY - offsetY;

        // Create an event handler to call dragCard when the mouse moves
        document.onmousemove = (move: MouseEvent) => {dragCard(move)};

        // Create an event handler to free the move event handler when the mouse button is released
        document.onmouseup = (release: MouseEvent) => {releaseCard(release)};
    }

    // Move the card around
    const dragCard = (e: MouseEvent) => {
        e.preventDefault();

        // Track speed
        speedX = -(lastPosX + offsetX - e.clientX);
        speedY = -(lastPosY + offsetY - e.clientY);
        lastPosX = e.clientX - offsetX;
        lastPosY = e.clientY - offsetY;

        // Assign card tilt based on speed
        tilt = Math.min(tiltMax, tiltAmplifier * Math.abs(speedX) + Math.abs(speedY));

        // Move the card to the mouse
        setCardStyle({...cardStyle, top: e.clientY - offsetY, left: e.clientX - offsetX, transform: `rotate3d(${speedY}, ${-speedX}, 0, ${tilt}deg)`});
    }

    // Release the card
    const releaseCard = (e: MouseEvent) => {
        document.onmousemove = null;
        document.onmouseup = null;

        setCardStyle({...cardStyle, top: e.clientY - offsetY, left: e.clientX - offsetX, transform: undefined});
    }

    return(
        <div className="card" onMouseDown={(click: any) => {grabCard(click)}} style={{...cardStyle}}>
            {img ? <img src={img} className="card_img"/> : ""}
            {children ? children : ""}
        </div>
    );
}

export default Card;