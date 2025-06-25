import { useState } from 'react';
import { type PropsWithChildren } from 'react';

import './styles/Card.css';

interface props_Card {
    img?: string
}

function Card({img = undefined, children = undefined}: PropsWithChildren<props_Card>)
{
    // Track card position in state
    const [cardPos, setCardPos] = useState<{top: number, left: number}>({top: 0, left: 0});
    let offsetX: number = 0;
    let offsetY: number = 0;

    // Grab the card with the cursor
    const grabCard = (e: React.MouseEvent) => {
        e.preventDefault();

        // Track the part of the card clicked
        offsetX = e.clientX - cardPos.left;
        offsetY = e.clientY - cardPos.top;

        // Create an event handler to call dragCard when the mouse moves
        document.onmousemove = (move: MouseEvent) => {dragCard(move)};

        // Create an event handler to free the move event handler when the mouse button is released
        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }

    // Move the card around
    const dragCard = (e: MouseEvent) => {
        e.preventDefault();

        // Move the card to the mouse
        setCardPos({...cardPos, top: e.clientY - offsetY, left: e.clientX - offsetX});
    }

    return(
        <div className="card" onMouseDown={(click: any) => {grabCard(click)}} style={{...cardPos}}>
            {img ? <img src={img} /> : ""}
            {children ? children : ""}
        </div>
    );
}

export default Card;