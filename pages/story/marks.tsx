import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {MyList} from "../../components/Profile";
import MainLayout from "../../layouts/MainLayout";
import {styled} from "@mui/material/styles";
import {useRouter} from "next/router";
import axios from "axios";
import style from '../../styles/SearchItem.module.scss';
import FavoriteIcon from "@mui/icons-material/Favorite";
import ListIcon from "@mui/icons-material/List";
import FilterBar from "../../components/FilterBar";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import {Button} from "@mui/material";
import classNames from "classnames";
import useMediaQuery from "@mui/material/useMediaQuery";
import json2mq from 'json2mq';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

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
const BootstrapTabP = styled(TabPanel)(({theme}) => ({
    '& .Mui-selected': {
        color: '#A01010!important'
    },
    '& .MuiTabs-indicator': {
        backgroundColor: '#A01010',
        height: '3px'
    },
    '& .MuiBox-root': {
        padding: '0px!important'
    }
}));

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Marks = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const [like, setLike] = React.useState({isActive: false, count: 0});
    const [marks, setMarks] = React.useState([]);
    const [chapters, setChapters] = React.useState([]);


    let token = '';
    let id = ''

    const router = useRouter();
    React.useEffect(() => {
        async function fetchMyAPI() {
            token = localStorage.getItem('token');
            id = localStorage.getItem('id');
            if (!token) {
                router.push('/authorization/')
            }
            const response = await axios.get('http://localhost:9000/stories/marks/current-user', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            const marks = [];
            response.data.forEach(mark => {
                const find = mark.likes.find((like) => like.id === id);
                mark = {...mark, isActive: find ? true : false, count: mark.likes.length}
                marks.push(mark);
            })
            setMarks(marks)
            const responseChapters = await axios.get('http://localhost:9000/chapters/marks/current-user', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            setChapters(responseChapters.data)
        }

        fetchMyAPI()
    }, [])


    const addLike = (storyId) => {
        token = localStorage.getItem('token');
        id = localStorage.getItem('id');
        if (token) {
            axios.get('http://localhost:9000/stories/' + storyId + '/like', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(resp => {
                    axios.get('http://localhost:9000/stories/marks/current-user', {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    }).then(response => {
                        const marks = [];
                        response.data.forEach(mark => {
                            const find = mark.likes.find((like) => like.id === id);
                            mark = {...mark, isActive: find ? true : false, count: mark.likes.length}
                            marks.push(mark);
                        })
                        setMarks(marks)
                    })

                })
        } else (router.push('/authorization/'))
    }

    const addMark = (storyId) => {
        token = localStorage.getItem('token');
        id = localStorage.getItem('id');
        if (token) {
            axios.get('http://localhost:9000/stories/' + storyId + '/mark', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(resp => {
                    axios.get('http://localhost:9000/stories/marks/current-user', {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    }).then(response => {
                        const marks = [];
                        response.data.forEach(mark => {
                            const find = mark.likes.find((like) => like.id === id);
                            mark = {...mark, isActive: find ? true : false, count: mark.likes.length}
                            marks.push(mark);
                        })
                        setMarks(marks)
                    })

                })
        } else (router.push('/authorization/'))
    }
    const matches = useMediaQuery(
        json2mq({
            minWidth: 850,
        }),
    );

    return (
        <MainLayout obj={'marks'}>
            <Box>
                <Box  sx={{display: 'flex', justifyContent: 'center'}}>
                    <BootstrapTabs style={matches? {margin: '100px 0 0'}: {margin: '0'}} sx={{padding: '0'}} value={value} onChange={handleChange}
                                   aria-label="basic tabs example">
                        <Tab label="Истории" {...a11yProps(0)} />
                        <Tab label="Главы" {...a11yProps(1)} />
                    </BootstrapTabs>
                </Box>
                <BootstrapTabP  value={value} index={0}>
                    <div className={style.section2} style={{margin: '5px 0'}}>
                        <div className={style.container2} style={{margin: '5px 0'}}>
                            <Box className={style.storyBlock}>
                                {marks.map(map => {
                                    return (
                                        <div className={classNames(style.storyOne,map.orientation === 'get' ? style.forGet : map.orientation === 'slesh' ? style.forSlesh : style.forFem)}>
                                            <div className={style.imageStory}><img style={{cursor: 'pointer'}} onClick={() => router.push('/story/' + map.id)}
                                                src={'http://localhost:9000/' + map.image}/></div>
                                            <div className={style.descriptionStory}><h3 style={{cursor: 'pointer'}} className={style.a}
                                                onClick={() => router.push('/story/' + map.id)}>{map.name}</h3>
                                                <div className={style.likes}>
                                                    {map.isActive ?
                                                        <FavoriteIcon onClick={() => addLike(map.id)}
                                                                      sx={{color: 'red', cursor: 'pointer'}}/> :
                                                        <FavoriteIcon onClick={() => addLike(map.id)}
                                                                      sx={{color: '#C9C9C9', cursor: 'pointer'}}/>}
                                                    <div>{map.count}</div>
                                                    <div style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        padding: '0 8px 0 0'
                                                    }}><ListIcon sx={{color: '#C9C9C9'}}/>
                                                        <div>{map.chapters.length}</div>
                                                    </div>
                                                    <div style={map.status === 'Завершено' ? {background: '#C0D1C5'} : map.status === 'Заморожено' ? {background: '#D7E1F2'} : {background: '#F5BDBD'}} className={style.status}>{map.status}</div>
                                                </div>
                                                <div className={style.descriptionSt2}>
                                                    {map.description}
                                                </div>
                                                <div className={style.ganresStory}>
                                                    {map.genres.map((genre, index) => index < 3 ?<div style={{cursor: 'pointer'}} onClick={() => router.push('/genres/'+genre.id)}>{genre.name}</div> : '')}
                                                </div>
                                                <div className={style.readMark}>
                                                    <button className={style.btn}
                                                            onClick={() => router.push('/story/' + map.id)}>Читать
                                                    </button>
                                                    <BookmarkIcon style={{cursor: 'pointer'}} onClick={() => addMark(map.id)} sx={{color: 'red'}}/>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </Box>
                        </div>
                    </div>
                </BootstrapTabP>
                <BootstrapTabP value={value} index={1}>
                    <div className={style.section2} style={{margin: '5px 0'}}>
                        <div className={style.container2} style={{margin: '5px 0'}}>
                            <Box className={style.storyBlock}>
                                {chapters.map(map => {
                                    return (
                                        <div className={style.storyOne}>
                                            <div className={style.imageStory}><img style={{cursor: 'pointer'}} onClick={() => router.push('/story/' + map.id)}
                                                src={'http://localhost:9000/' + map.story.image}/></div>
                                            <div className={style.descriptionStory}><h3 style={{cursor: 'pointer'}} className={style.a}
                                                                                        onClick={() => router.push('/chapter/' + map.id)}>{map.story.name}</h3>
                                                <h3 style={{cursor: 'pointer'}} onClick={() => router.push('/chapter/' + map.id)}>{map.name}</h3>
                                                <div style={{maxHeight: '55%', overflow: 'hidden'}} className="descriptionSt">
                                                    {map.text}
                                                </div>
                                                <div className={style.readMark}>
                                                    <button className={style.btn}
                                                            onClick={() => router.push('/story/' + map.id)}>Читать
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </Box>
                        </div>
                    </div>
                </BootstrapTabP>
            </Box>
        </MainLayout>
    );
};

export default Marks;


