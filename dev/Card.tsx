import { useState } from 'react';
import { type PropsWithChildren } from 'react';

import { CardPosition, CardSize, CardAnimation, CardStyle } from './assets/types.js';

import './assets/styles/Card.css';

interface props_Card {
    frontImg?: string,
    backImg?: string,
    color?: string,
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

export function Card({
        frontImg = undefined, 
        backImg = undefined,
        color = "black", 
        dimensions = {width: 63, height: 88, units: "mm"},
        position = {x: 0, y: 0}, 
        children = undefined
    }: PropsWithChildren<props_Card>)
{
    // State for tracking card details
    const [cardPosition, setCardPosition] = useState<CardPosition>({
        top: position.y, 
        left: position.x, 
    });
    const [cardSize, setCardSize] = useState<CardSize>({
        width: dimensions.width.toString() + dimensions.units,
        height: dimensions.height.toString() + dimensions.units,
    });
    const [cardAnimation, setCardAnimation] = useState<CardAnimation>({});
    const [cardStyle, setCardStyle] = useState<CardStyle>({
        backgroundColor: color
    })

    // Variables for tracking which part of the card the user grabbed
    let offsetX: number = 0;            // Distance between card left property and the position of the cursor when card is grabbed
    let offsetY: number = 0;            // Distance between card top property and the position of the cursor when card is grabbed

    // Variables for tracking card movement speed
    let lastPosX: number = 0;           // Card left property value in previous tick whilst dragging card
    let lastPosY: number = 0;           // Card top property value in previous tick whilst dragging card
    let speedX: number = 0;             // Number of pixels traversed by card in X direction during this tick
    let speedY: number = 0;             // Number of pixels traversed by card in Y direction during this tick

    // Variable for tracking card angle in 3d space
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    let tilt: number = 0;               // Angle of card in 3d space
    const tiltAmplifier: number = 2;    // Constant multiplied into tilt to exaggerate the angle
    const tiltShadow: number = 20;      // Constant reciprocal multiplied into speed to adjust box-shadow to follow card
    const tiltMax: number = 45;         // Constant maximum allowable value of tilt * tiltAmplifier

    // Grab the card with the cursor
    const grabCard = (e: React.MouseEvent) => {
        e.preventDefault();

        console.log(isFlipped);

        // Track the part of the card clicked
        offsetX = e.clientX - cardPosition.left;
        offsetY = e.clientY - cardPosition.top;

        // Set speed-tracking variables 
        lastPosX = e.clientX - offsetX;
        lastPosY = e.clientY - offsetY;

        setCardAnimation({...cardAnimation, boxShadow: `0em 0em 1em black`});

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
        setCardPosition({...cardPosition, 
            top: e.clientY - offsetY, 
            left: e.clientX - offsetX
        });
        setCardAnimation({...cardAnimation,
            transform: `rotate3d(${speedY}, ${-speedX}, 0, ${tilt}deg)`,
            boxShadow: `${-speedX / tiltShadow}rem ${-speedY / tiltShadow}rem 1em black`
        });
    }

    // Release the card
    const releaseCard = (e: MouseEvent) => {
        e.preventDefault();

        document.onmousemove = null;
        document.onmouseup = null;

        // Remove any leftover tilt and box-shadow
        setCardPosition({...cardPosition, top: e.clientY - offsetY, left: e.clientX - offsetX});
        setCardAnimation({...cardAnimation, transform: undefined, boxShadow: undefined});
    }

    // Flip the card
    const flipCard = (e: React.MouseEvent) => {
        e.preventDefault();

        setIsFlipped(!isFlipped);
    }

    return(
        <div className="card" onContextMenu={(click: any) => {flipCard(click)}} onMouseDown={(click: any) => {grabCard(click)}} style={{...cardPosition, ...cardSize, ...cardAnimation}}>
            <div className={`card-front ` + (isFlipped ? "" : "card-back-face")} style={{...cardStyle}}>
                {frontImg ? <img src={frontImg} className="card_img" alt="Front Face"/> : "Front Face"}
            </div>
            <div className={`card-back ` + (isFlipped ? "card-back-face" : "")} style={{...cardStyle}}>
                <img src={backImg ? backImg : "./assets/img/default_card_back.jpg"} className="card_img" alt="Back Face"/>
            </div>
        </div>
    );
}