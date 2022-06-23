import {Box, Tab, Tabs} from '@mui/material';
import React from 'react';
import MainLayout from "./../../layouts/MainLayout";
import style from './../styles/Profile.module.scss'
import {styled} from "@mui/material/styles";
import AdministrationPanel from "./../../components/AdministrationPanel";

const BootstrapTabs = styled(Tabs)(({theme}) => ({
    '& .Mui-selected': {
        color: '#A01010!important'
    },
    '& .MuiTabs-indicator': {
        backgroundColor: '#A01010',
        height: '3px'
    },
    '& .MuiBox-root': {
        padding: '0px!important',
        backgroundColor: 'red'
    }
}));

const Index = () => {

    return (
        <MainLayout>

            <AdministrationPanel/>
        </MainLayout>
    );
};

export default Index;