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
}

function Card({img = undefined, dimensions = {width: 63, height: 88, units: "mm"}, children = undefined}: PropsWithChildren<props_Card>)
{
    type CardStyle = {
        top: number,
        left: number,
        width?: string,
        height?: string
    }

    // Object which holds all the data for the style attribute of this element
    const [cardStyle, setCardStyle] = useState<CardStyle>({top: 0, left: 0});

    // Variables for tracking which part of the card the user grabbed
    let offsetX: number = 0;
    let offsetY: number = 0;

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
        setCardStyle({...cardStyle, top: e.clientY - offsetY, left: e.clientX - offsetX})
    }

    return(
        <div className="card" onMouseDown={(click: any) => {grabCard(click)}} style={{...cardStyle}}>
            {img ? <img src={img} className="card_img"/> : ""}
            {children ? children : ""}
        </div>
    );
}

export default Card;