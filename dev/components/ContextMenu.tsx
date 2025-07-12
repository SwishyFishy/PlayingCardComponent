import './../assets/styles/ContextMenu.css';

// Type Declarations //
///////////////////////
type ContextMenuPosition = {
    top: number,
    left: number
}

// Props Type
interface props_ContextMenu {
    position: ContextMenuPosition
    show: boolean
}

// Context Menu //
//////////////////
export function ContextMenu({position, show}: props_ContextMenu)
{
    return (
        <div 
            onMouseDown={(click: any) => {click.stopPropagation()}}     // Stops the document mousedown listener from hiding the menu
            className={"card_context_menu" + (show ? "" : " hidden")}
            style={position}
        >
            <p>Hello World!</p>
        </div>
    );
}