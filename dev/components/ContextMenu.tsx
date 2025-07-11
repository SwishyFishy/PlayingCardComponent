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
            className={"card_context_menu" + (show ? "" : " hidden")}
            style={position}
        >
            <p>Hello World!</p>
        </div>
    );
}