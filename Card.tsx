import { useState } from 'react';

import './styles/Card.css';

function Card()
{
    // Track card and mouse position in state
    const [cardPos, setCardPos] = useState<{top: number, left: number}>({top: 0, left: 0});

    // Grab the card with the cursor
    const grabCard = (e: React.MouseEvent) => {
        e.preventDefault();

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
        setCardPos({...cardPos, top: e.clientY, left: e.clientX});
    }

    return(
        <div className="card" onMouseDown={(click: any) => {grabCard(click)}} style={{...cardPos}}></div>
    );
}

export default Card;