import './../assets/styles/ContextMenu.css';

// Type Declarations //
///////////////////////
type ContextMenuCardControl = {
    callback: Function,
    description: string
}
type ContextMenuPosition = {
    top: number,
    left: number
}

// Props Type
interface props_ContextMenu {
    cardControls?: ContextMenuCardControl[]
    position: ContextMenuPosition
    show: boolean
}

// Context Menu //
//////////////////
export function ContextMenu({cardControls = [], position, show}: props_ContextMenu)
{
    return (
        <div className={"card_context_menu" + (show ? "" : " hidden")}
            onMouseDown={(click: any) => {click.stopPropagation()}}     // Stops the document mousedown listener from hiding the menu
            style={position}
        >
            <ul>
                {cardControls.map((control, index) => (
                    <li key={index} onClick={() => {control.callback()}}>{control.description}</li>
                ))}
            </ul>
        </div>
    );
}