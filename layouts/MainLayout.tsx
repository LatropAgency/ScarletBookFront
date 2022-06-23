import React, {PropsWithChildren} from 'react';
import NavbarMobile from "../components/NavbarMobile";
import {Props} from "next/script";
import {Navbar} from "../components/Navbar";
import json2mq from 'json2mq';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Head} from 'next/document';
interface MainLayoutProps {
    title?: string;
    description?: string;
    keywords?: string;
    obj?: string
}

const MainLayout: React.FC<PropsWithChildren<MainLayoutProps>> = ({
                                                            children,
                                                            obj,
                                                            title,
                                                            description,
                                                            keywords
                                                        }) => {
    const matches = useMediaQuery(
        json2mq({
            minWidth: 850,
        }),
    );

    return (
        <>
            {/*<Head>*/}
            {/*    <title>{title || 'ScarletBook'}</title>*/}
            {/*    <meta name="description"*/}
            {/*          content={description}/>*/}
            {/*    <meta name="robots" content="index, follow"/>*/}
            {/*    <meta name="keywords" content={keywords || "ScarletBook, Фанфики"}/>*/}
            {/*    <meta name="viewport" content="width=device-width, initial-scale=1"/>*/}
            {/*</Head>*/}
            {matches ? <Navbar/> :
                <NavbarMobile state={obj}/>}
            {children}

            <style jsx global>{`
              body {
                margin: 100px 0 105px;
                padding: 0;
              }
            `}</style>
        </>
    );
};

export default MainLayout;