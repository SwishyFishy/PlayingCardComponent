# Animated Playing Card

A TypeScript React component that emulates a physical playing card. The component can be picked up and dragged around the screen using the cursor, and animates in 3D space based on the speed and direction of its movement.

## Usage

This package is a React component.

### Basic Usage

**Install** 

```npm i animated-playing-card```

**Use**

```Javascript
import { Card } from "animated-playing-card";

<Card/>                                                 // A blank card, or one with an image
<Card><div className="card_content">...</div><Card/>    // A card with HTML content

```
Elements inside a card do not need to be contained within a ```<div>```. It is recommended, however, for ease of styling via CSS.

### Card Attributes


* ```img="image_name"```
    > Fills the card with the image. If not provided, the card is populated with any provided children.
* ```color="any valid representation of colour in CSS"```
    > The background colour of the card. If not provided, the background of the card is coloured `black`. Recommended if the card displays HTML content, as the transformations applied to the card while moving may reveal slivers of the background.
* ```dimensions={{width: int, height: int, units: "mm" | "px" | "rem" | "%"}}```
    > Sets the dimensions of the card using the CSS unit provided. If not provided, the dimensions are set to those of a standard physical playing card; 63x88mm. 
* ```position={{x: int, y: int}}```
    > Sets the starting position of the top-left corner of the card on the page, where the top left corner of the page is (0, 0). If not provided, the card appears at (0, 0).