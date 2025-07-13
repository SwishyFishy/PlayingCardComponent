# Animated Playing Card

A TypeScript React component that emulates a physical playing card. The component can be picked up and dragged around the screen using the cursor, and animates in 3D space based on the speed and direction of its movement.

## Usage

This package is a React component.

### Install

```npm i animated-playing-card```

### Import

```Javascript
import { Card } from "animated-playing-card";

<Card/>             // A blank card, or one with an image
<Card><Card/>       // A card that can contain HTML content
```

## Card Attributes

* ```frontImg="image_path"```
    > Fills the front face of the card with the image. If not provided, the card is populated with any provided children.
* ```backImg="image_path"```
    > Fills the back face of the card with the image. If not provided, the card is populated with the default card back image.
* ```dimensions={{width: number, height: number, units: "mm" | "px" | "rem" | "%"}}```
    > Sets the dimensions of the card using the CSS unit provided. If not provided, the dimensions are set to those of a standard physical playing card; 63x88mm.
* ```position={{x: number, y: number}}```
    > Sets the starting position of the top-left corner of the card on the page, where the top left corner of the page is (0, 0). If not provided, the card appears at (0, 0).
* ```contextControls={[{callback: Function, description: string}, ...]}```
  > Adds each provided callback function to the right-click context menu of the card, assigned to the onClick event of a button with the description as its label.
