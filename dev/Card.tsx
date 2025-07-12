import { useState } from 'react';
import { type PropsWithChildren } from 'react';

import { ContextMenu } from './components/ContextMenu.js';

import cardBack from './assets/img/default_card_back.jpg';

import './assets/styles/Card.css';

// Type Declarations //
///////////////////////
type CardPosition = {
    top: number,
    left: number,
}
type CardSize = {
    width: string,
    height: string
}
type CardAnimation = {
    transform?: string,
    boxShadow?: string
}
type CardStyle = {
    backgroundColor: string
}
type ContextMenuDisplay = {
    top: number,
    left: number,
    show: boolean
}

// Props Type
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

// Card //
//////////
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
    const [contextMenuDisplay, setContextMenuDisplay] = useState<ContextMenuDisplay>({
        top: position.y, 
        left: position.x,
        show: false
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

        // Track the part of the card clicked
        offsetX = e.clientX - cardPosition.left;
        offsetY = e.clientY - cardPosition.top;

        // Set speed-tracking variables 
        lastPosX = e.clientX - offsetX;
        lastPosY = e.clientY - offsetY;

        setCardAnimation({...cardAnimation, boxShadow: `.5rem .5rem 2rem black`});

        // Create an event handler to call dragCard when the mouse moves
        document.addEventListener('mousemove', dragCard);

        // Create an event handler to free the move event handler when the mouse button is released
        document.addEventListener('mouseup', releaseCard);
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
            boxShadow: `${.5 + -speedX / tiltShadow}rem ${.5 + -speedY / tiltShadow}rem 1rem black`
        });
    }

    // Release the card
    const releaseCard = (e: MouseEvent) => {
        e.preventDefault();

        // Remove the card-movement event handlers
        document.removeEventListener('mousemove', dragCard);
        document.removeEventListener('mouseup', releaseCard);

        // Remove any leftover tilt and box-shadow
        setCardPosition({...cardPosition, top: e.clientY - offsetY, left: e.clientX - offsetX});
        setCardAnimation({...cardAnimation, transform: undefined, boxShadow: undefined});
    }

    // Flip the card
    const flipCard = (e: React.MouseEvent) => {
        e.preventDefault();

        setIsFlipped(!isFlipped);
    }

    // Show the card context menu
    const showCardContext = (e: React.MouseEvent) => {
        e.preventDefault();

        setContextMenuDisplay({...contextMenuDisplay, top: e.clientY, left: e.clientX, show: true});
    }

    return(
        <>
            <div className="card" 
                onContextMenu={(click: any) => {showCardContext(click)}}
                onDoubleClick={(click: any) => {flipCard(click)}} 
                onMouseDown={(click: any) => {click.button == 0 && grabCard(click)}}
                style={{...cardPosition, ...cardSize, ...cardAnimation}}
            >
                <div className={`card-front ` + (isFlipped ? "card-back-face" : "")} style={cardStyle}>
                    {frontImg ? <img src={frontImg} className="card_img" alt="Front Face"/> : children}
                </div>
                <div className={`card-back ` + (isFlipped ? "" : "card-back-face")} style={cardStyle}>
                    <img src={backImg ? backImg : cardBack} className="card_img" alt="Back Face"/>
                </div>
            </div>
            <ContextMenu show={contextMenuDisplay.show} position={{top: contextMenuDisplay.top, left: contextMenuDisplay.left}}/>
        </>
    );
}