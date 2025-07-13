import { useState } from 'react';
import { type PropsWithChildren } from 'react';

import { ContextMenu } from './components/ContextMenu.js';
import { type ContextMenuCardControl } from './components/ContextMenu.js';

import cardBack from './assets/img/default_card_back.jpg';

import './assets/styles/Card.css';

// Type Declarations //
///////////////////////
type CardPosition = {
    top: number,
    left: number,
    width: string,
    height: string,
}
type CardTransform = {
    transform?: string,
    boxShadow?: string
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
    dimensions?: {
        width: number,
        height: number,
        units: "mm" | "px" | "rem" | "%"
    },
    position?: {
        x: number,
        y: number
    },
    contextControls?: ContextMenuCardControl[]
}

// Card //
//////////
export function Card({
        frontImg = undefined, 
        backImg = undefined,
        dimensions = {width: 63, height: 88, units: "mm"},
        position = {x: 0, y: 0}, 
        contextControls = [],
        children = undefined
    }: PropsWithChildren<props_Card>)
{
    // Variable Declaration //
    //////////////////////////

    // Track card position and size
    const [cardPosition, setCardPosition] = useState<CardPosition>({
        top: position.y, 
        left: position.x,
        width: `${dimensions.width}${dimensions.units}`,
        height: `${dimensions.height}${dimensions.units}`
    });

    // Track context menu position and visibility
    const [contextMenuDisplay, setContextMenuDisplay] = useState<ContextMenuDisplay>({
        top: position.y, 
        left: position.x,
        show: false
    })

    // Track where on the card the user selected it
    let offsetX: number = 0;            // Distance between card left property and the position of the cursor when card is grabbed
    let offsetY: number = 0;            // Distance between card top property and the position of the cursor when card is grabbed

    // Track card movement and speed
    let lastPosX: number = 0;           // Card left property value in previous tick whilst dragging card
    let lastPosY: number = 0;           // Card top property value in previous tick whilst dragging card
    let speedX: number = 0;             // Number of pixels traversed by card in X direction during this tick
    let speedY: number = 0;             // Number of pixels traversed by card in Y direction during this tick

    // Track card transformation
    const [cardTransform, setCardTransform] = useState<CardTransform>({});
    const [scale, setScale] = useState<number>(1);
    const [flipped, setFlipped] = useState<boolean>(false);
    let tilt: number = 0;               // Angle of card in 3d space
    const tiltAmplifier: number = 2;    // Constant multiplied into tilt to exaggerate the angle
    const tiltShadow: number = 20;      // Constant reciprocal multiplied into speed to adjust box-shadow to follow card
    const tiltMax: number = 45;         // Constant maximum allowable value of tilt * tiltAmplifier

    // Event Handlers //
    ////////////////////

    // Grab the card with the cursor
    const grabCard = (e: React.MouseEvent) => {
        e.preventDefault();

        // Track the part of the card clicked
        offsetX = e.clientX - cardPosition.left;
        offsetY = e.clientY - cardPosition.top;

        // Set speed-tracking variables 
        lastPosX = e.clientX - offsetX;
        lastPosY = e.clientY - offsetY;

        setCardTransform({...cardTransform, boxShadow: `0rem 0rem 1rem black`});

        // Create an event handler to call dragCard when the mouse moves
        document.addEventListener('mousemove', dragCard);

        // Create an event handler to free the move event handler when the mouse button is released
        document.addEventListener('mouseup', releaseCard);
    }

    // Move the card around
    const dragCard = (e: MouseEvent) => {
        e.preventDefault();

        // Update speed
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
        setCardTransform({...cardTransform,
            transform: `scale(${scale}) rotate3d(${speedY}, ${-speedX}, 0, ${tilt}deg)`,
            boxShadow: `${-speedX / tiltShadow}rem ${-speedY / tiltShadow}rem 1rem black`
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
        setCardTransform({...cardTransform, transform: `scale(${scale})`, boxShadow: undefined});
    }

    // Flip the card
    const flipCard = (e: React.MouseEvent) => {
        e.preventDefault();

        setFlipped(!flipped);
    }

    // Show the card context menu
    const showCardContext = (e: React.MouseEvent) => {
        e.preventDefault();

        setContextMenuDisplay({...contextMenuDisplay, top: e.clientY, left: e.clientX, show: true});

        // Create an event listener on the document to close the context menu and remove the event listener on click
        document.addEventListener('mousedown', () => {
            setContextMenuDisplay({...contextMenuDisplay, show: false});
        }, {once: true});
    }

    // Enlarge the card
    const growCard = () => {
        setScale(scale + .05);
        setCardTransform({...cardTransform, transform: `scale(${scale + .05})`});   // State doesn't update until next render
    }

    // Shrink the card
    const shrinkCard = () => {
        let newScale: number = scale > 0.05 ? scale - 0.05 : scale;
        setScale(newScale);
        setCardTransform({...cardTransform, transform: `scale(${newScale})`});      // State doesn't update until next render
    }

    return(
        <>
            <div className="card" 
                onContextMenu={(click: any) => {showCardContext(click)}}
                onDoubleClick={(click: any) => {flipCard(click)}} 
                onMouseDown={(click: any) => {click.button == 0 && grabCard(click)}}
                style={{...cardPosition, ...cardTransform}}
            >
                <div className={`card-front ${(flipped ? "card-back-face" : "")}`}>
                    {frontImg ? <img src={frontImg} className="card_img" alt="Front Face"/> : children}
                </div>
                <div className={`card-back ${(flipped ? "" : "card-back-face")}`}>
                    <img src={backImg ? backImg : cardBack} className="card_img" alt="Back Face"/>
                </div>
            </div>
            <ContextMenu
                cardControls={[...contextControls,
                    {callback: growCard, description: "Zoom In"}, 
                    {callback: shrinkCard, description: "Zoom Out"}
                ]}
                position={{top: contextMenuDisplay.top, left: contextMenuDisplay.left}}
                show={contextMenuDisplay.show}
            />
        </>
    );
}