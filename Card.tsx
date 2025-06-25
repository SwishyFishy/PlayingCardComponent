import { useState } from 'react';

import './styles/Card.css';

function Card()
{
    // Track card and mouse position in state
    const [cardPos, setCardPos] = useState<{top: number, left: number}>({top: 0, left: 0});
    const [mousePos, setMousePos] = useState<{mouseX: number, mouseY: number}>({mouseX: 0, mouseY: 0});

    // Grab the card with the cursor
    const grabCard = (e: any) => {
        e.preventDefault();

        console.log("Grabbed");

        // Get cursor starting position
        setMousePos({mouseX: e.clientX, mouseY: e.clientY});

        // Create an event handler to call dragCard when the mouse moves
        document.onmousemove = (e: MouseEvent) => {dragCard(e)};

        // Create an event handler to free the move event handler when the mouse button is released
        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
        }

    }

    // Move the card around
    const dragCard = (e: MouseEvent) => {
        e.preventDefault();

        // Move the card to the mouse and get the next mouse position
        setCardPos({...cardPos, top: mousePos.mouseX, left: mousePos.mouseY});
        setMousePos({mouseX: e.clientX, mouseY: e.clientY});
    }

    return(
        <div className="card" onMouseDown={(e: any) => {grabCard(e)}} style={{...cardPos}}>
        </div>
    );
}

export default Card;