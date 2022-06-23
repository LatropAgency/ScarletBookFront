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
const Orientation = () =>{
    return(
        <div style={{margin: '5px 0'}} className={style.section2}>

            <div style={{margin: '5px 0'}} className={style.container2}>
                <div className={style.storyOne}>
                    <div className={style.imageStory}><img src='../../static/images/getImg.jpg'/></div>
                    <div className={style.descriptionStory}><h3>Гет</h3>
                        <p>Гет — один из жанров фанфикшена, используемый на «Книге фанфиков». По определению ресурса:

                            — в центре истории романтические и/или сексуальные отношения между мужчиной и женщиной.

                            Один из базовых направленности, показывающей, что одной из основных тем работы являются гетеросексуальные отношения.</p>
                    </div>
                </div>
                <div className={style.storyOne}>
                    <div className={style.imageStory}><img src="../../static/images/sleshImg.jpg"/></div>
                    <div className={style.descriptionStory}><h3>Слэш</h3>
                        <p>
                            Слэш (в кругах, близких к манге и аниме, — Яой) — один из жанров фанфикшена, используемый на

                            «Книге фанфиков». По определению ресурса:

                            — Слэш — в центре истории романтические и/или сексуальные отношения между мужчинами

                            Один из базовых жанров, показывающий, что одной из основных тем работы являются гомосексуальные отношения.
                        </p>
                    </div>
                </div>
                <div className={style.storyOne}>
                    <div className={style.imageStory}><img src='../../static/images/femImg.jpg'/></div>
                    <div className={style.descriptionStory}><h3>Фемслэш</h3>
                        <p>
                            Фемслэш (в кругах, близких к манге и аниме — Юри) — один из жанров фанфикшена, используемый на «Книге фанфиков». По определению ресурса— в центре истории романтические и/или сексуальные отношения между женщинами

                            Один из базовых жанров, показывающий, что одной из основных тем работы являются гомосексуальные отношения.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

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
        <MainLayout obj='Info'>
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
                    <Tab label="Фандомы" />
                    <Tab label="Направленности" />
                    <Tab label="Жанры" />
                </BootstrapTabs>
            </Box>

            {value===0 ?<Fandoms type='fandoms'/>: ''}
            {value===1 ?<Orientation/>: ''}
            {value===2 ?<Fandoms type='genres'/>: ''}
        </MainLayout>
    );
};

export default Index;