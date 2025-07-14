import { PropsWithChildren } from 'react';
import { Children } from 'react';

export function CardController({children}: PropsWithChildren)
{
    const childrenArray = Children.toArray(children);
    childrenArray.forEach((child) => {
        console.log(child);
    })
    return(
        <>
            {children}
        </>
    );
}