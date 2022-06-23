import React from 'react';
import FilterBar from "../../components/FilterBar";
import MainLayout from "../../layouts/MainLayout";
import SearchItem from "../../components/SearchItem";
import {Tab, Tabs, TextField} from "@mui/material";
import {Box} from "@mui/system";
import {styled} from "@mui/material/styles";
import Fandoms from "../../components/Fandoms";
import {Search} from "@mui/icons-material";
import SearchItems from "../../components/SearchItems";
import useMediaQuery from "@mui/material/useMediaQuery";
import json2mq from 'json2mq';
import style from "../../styles/SearchItem.module.scss";

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
    const [value, setValue] = React.useState(0);
    const matches = useMediaQuery(
        json2mq({
            minWidth: 850,
        }),
    );

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <MainLayout obj='Search'>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <BootstrapTabs
                    style={matches? {margin: '100px 0 0'}: {margin: '0'}}
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    aria-label="scrollable force tabs example"
                >
                    <Tab label="Фильтры" />
                    <Tab label="Поиск" />
                </BootstrapTabs>
            </Box>
            {value===0 ?<SearchItem/>: ''}
            {value===1 ? <SearchItems/>: ''}
        </MainLayout>
    );
};

export default Index;