import { Outlet } from "@remix-run/react";


export default function Step()
{
    return <div style={{ display: 'grid', gap: '1em', placeContent: 'start' }}>
        <Outlet />
    </div>;
}