import { PropsWithChildren } from 'react';
import { Children } from 'react';

export function CardController({children}: PropsWithChildren)
{
<<<<<<< HEAD
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

=======
    const childrenArray = Children.toArray(children);
    childrenArray.forEach((child) => {
        console.log(child);
    })
>>>>>>> 6a29661f2390815e9dd1560eca5bc6e8a9994358
    return(
        <>
            {children}
        </>
    );
}