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

export function ContextMenu({position, show}: props_ContextMenu)
{
    return (
        <div 
            className={show ? "card_context_menu" : "card_context_menu hidden"}
            style={position}
        >
            <p>Hello World!</p>
        </div>
    );
}