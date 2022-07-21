import { Outlet } from "@remix-run/react";
import { styled } from '../../stiches.config.js';


export default function Step()
{
    return <Root>
        <Outlet />
    </Root>;
}

const Root = styled('div', {
    display: 'grid',
    gap: '$bigger',
    placeContent: 'start',
});