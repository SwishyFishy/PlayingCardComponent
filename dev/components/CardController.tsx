import { PropsWithChildren } from 'react';
import { Children } from 'react';

export function CardController({children}: PropsWithChildren)
{
    const iterateChildren = (children: React.ReactNode) => {
        Children.map(children, (child) => {
            if ((child as {type: Function}).type?.name == "Card")
            {
                console.log('yes', child);
            }
            else{
                console.log('no', child);
                if (typeof child == "Object" && child.props)
                {
                    iterateChildren(child!.props.children);
                }
            }
        });
    }

    iterateChildren(children);

    return(
        <>
            {children}
        </>
    );
}