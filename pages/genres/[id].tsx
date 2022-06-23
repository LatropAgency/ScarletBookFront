import React, {useState} from 'react';
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
import classNames from "classnames";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ListIcon from "@mui/icons-material/List";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import {useRouter} from "next/router";
import axios from "axios";
import {GetServerSideProps} from "next";

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

const Index = ({storiesServer, genreId}) => {
    const [value, setValue] = React.useState(0);
    const matches = useMediaQuery(
        json2mq({
            minWidth: 850,
        }),
    );
    const filter = {
        "fandomsIds": [],
        "genresIds": [genreId],
        "age": [],
        "orientation": [],
        "status": []
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const router = useRouter();
    const [stories, setStories] = useState(storiesServer)
    const [marks, setMarks] = React.useState([]);
    const [token, setToken] = useState('');
    const [id, setId] = useState('');
    const [fandom, setFandom] = useState({name: ''});
    let first = true;
    React.useEffect(() => {
        async function fetchMyAPI() {
            setToken(localStorage.getItem('token'));
            setId(localStorage.getItem('id'));
            const resp = await axios.get('http://localhost:9000/genres/' + genreId);
            setFandom(resp.data);
            const story = [];
            storiesServer.forEach(mark => {
                const find = mark.likes.find((like) => like.id === localStorage.getItem('id'));
                mark = {...mark, isActive: find ? true : false, count: mark.likes.length}
                const find2 = mark.marks.find((mark) => mark.id === localStorage.getItem('id'));
                mark = {...mark, isActiveMark: find2 ? true : false}
                story.push(mark);
            })
            setStories(story)
        }

        fetchMyAPI()
    }, [])


    const addLike = (storyId) => {
        let token = localStorage.getItem('token');
        let id = localStorage.getItem('id');
        if (token) {
            axios.get('http://localhost:9000/stories/' + storyId + '/like', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(resp => {
                    axios.post('http://localhost:9000/stories/get-stories/by-filters', filter).then(response => {
                        const story = [];
                        response.data.forEach(mark => {
                            const find = mark.likes.find((like) => like.id === localStorage.getItem('id'));
                            mark = {...mark, isActive: find ? true : false, count: mark.likes.length}
                            const find2 = mark.marks.find((mark) => mark.id === localStorage.getItem('id'));
                            mark = {...mark, isActiveMark: find2 ? true : false}
                            story.push(mark);
                        })
                        setStories(story)
                    })

                })
        } else (router.push('/authorization/'))
    }
    const addMark = (storyId) => {
        let token = localStorage.getItem('token');
        let id = localStorage.getItem('id');
        if (token) {
            axios.get('http://localhost:9000/stories/' + storyId + '/mark', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(resp => {
                    axios.post('http://localhost:9000/stories/get-stories/by-filters', filter).then(response => {
                        const story = [];
                        response.data.forEach(mark => {
                            const find = mark.likes.find((like) => like.id === localStorage.getItem('id'));
                            mark = {...mark, isActive: find ? true : false, count: mark.likes.length}
                            const find2 = mark.marks.find((mark) => mark.id === localStorage.getItem('id'));
                            mark = {...mark, isActiveMark: find2 ? true : false}
                            story.push(mark);
                        })
                        setStories(story)
                    })

                })
        } else (router.push('/authorization/'))
    }
    return (
        <MainLayout>
            <div style={{margin: '5px 0'}} className={style.section2}>
                <div style={{margin: '5px 0'}} className={style.container2}>
                    <Box sx={{display: 'flex', justifyContent: 'center', width: '100%', margin:'0 0 15px 0'}}>
                        <BootstrapTabs
                            style={matches ? {margin: '100px 0 0'} : {margin: '0'}}
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons
                            allowScrollButtonsMobile
                            aria-label="scrollable force tabs example"
                        >
                            <Tab label={fandom.name}/>
                        </BootstrapTabs>
                    </Box>
                    <Box className={style.storyBlock}>
                        {stories.map(map => {
                            return (
                                <div
                                    className={classNames(style.storyOne, map.orientation === 'get' ? style.forGet : map.orientation === 'slesh' ? style.forSlesh : style.forFem)}>
                                    <div className={style.imageStory} style={{cursor: 'pointer'}} onClick={() => router.push('/story/' + map.id)}><img
                                        src={"http://localhost:9000/" + map.image}/></div>
                                    <div className={style.descriptionStory}><h3 className={style.a}
                                        style={{cursor: 'pointer'}} onClick={() => router.push('/story/' + map.id)}>{map.name}</h3>
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
                                        <div className={style.descriptionSt}>
                                            {map.description}
                                        </div>
                                        <div className={style.ganresStory}>
                                            {map.genres.map((genre, index) => <div style={{cursor: 'pointer'}} onClick={() => router.push('/genres/'+genre.id)}>{index < 3 ? genre.name : ''}</div>)}
                                        </div>
                                        <div className={style.readMark}>
                                            <button className={style.btn}
                                                    onClick={() => router.push('/story/' + map.id)}>Читать
                                            </button>
                                            {map.isActiveMark ?
                                                <BookmarkIcon style={{cursor: 'pointer'}} onClick={() => addMark(map.id)} sx={{color: 'red'}}/> :
                                                <BookmarkIcon style={{cursor: 'pointer'}} onClick={() => addMark(map.id)} sx={{color: '#C9C9C9'}}/>}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </Box>
                </div>
            </div>
        </MainLayout>
    );
};

export default Index;
export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const filter = {
        "fandomsIds": [],
        "genresIds": [params.id],
        "age": [],
        "orientation": [],
        "status": []
    }
    const response = await axios.post('http://localhost:9000/stories/get-stories/by-filters', filter)
    return {
        props: {
            storiesServer: response.data,
            genreId: params.id
        }
    }
}