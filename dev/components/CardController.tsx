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
            else
            {
                console.log('no', child);
                if (typeof child == "object" && 'props' in child!)
                {
                    iterateChildren((child! as {props: any}).props.children);
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