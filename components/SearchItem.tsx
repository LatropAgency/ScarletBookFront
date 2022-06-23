// @ts-nocheck
import React, {useState} from 'react';
import {Root} from "postcss";
import style from './../styles/SearchItem.module.scss';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ListIcon from '@mui/icons-material/List';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import {Box, Button, Dialog} from "@mui/material";
import FilterBar from "./FilterBar";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {styled} from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import {useInput} from "./../hooks/useInput";
import axios from "axios";
import classNames from "classnames";
import {useRouter} from "next/router";

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
    const { onClose, selectedValue, open } = props;
    const [error, setError] = useState('')

    const handleClose = () => {
        onClose(selectedValue);
    };
    const name = useInput('')
    const description = useInput('')
    const handleListItemClick = (value: string) => {
        onClose(value);
    };
    const send = async (value: string) => {
        if(name.value.length!==0 || description.value.length !== 0) {
            await axios.post('http://localhost:9000/requests', {
                type: selectedValue,
                name: name.value,
                description: description.value
            }, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            onClose(value);
        } else setError('Поля обязательные')
    }
    console.log(selectedValue)

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>{selectedValue ==='genres'?'Добавить жанр':'Добавить фандом'}</DialogTitle>
            <List sx={{ pt: 0 }}>
                <ListItem >
                    <Typography variant="subtitle1" component="div">
                        {error}
                    </Typography>
                </ListItem>
                <ListItem >
                    <Typography variant="subtitle1" component="div">
                        {selectedValue ==='genres'?'Жанр':'Фандом'}
                    </Typography>
                </ListItem>
                <ListItem >
                    <TextField {...name}
                        error
                        id="standard-error"
                        variant="standard"
                    />
                </ListItem>
                <ListItem >
                    <Typography variant="subtitle1" component="div">
                        Описание
                    </Typography>
                </ListItem>
                <ListItem >
                    <TextField {...description}
                        error
                        id="standard-error"
                        variant="standard"
                    />
                </ListItem>
                <ListItem style={{display: 'flex', justifyContent: 'center'}} autoFocus button>
                    <Button onClick={() => send('send')} style={{backgroundColor: '#FF2400',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '0.5px 6px',
                        height: '25px',
                        fontSize: '9pt',
                        color: 'white',
                        fontWeight: 'bold',
                        marginRight: '5px',
                        cursor: 'pointer'}}>Отправить
                    </Button>
                </ListItem>
            </List>
        </Dialog>
    );
}

const StyledChip = styled(Chip)({
    '& .MuiChip-label':{
        padding: '6px!important'
    }
})

const SearchItem = () => {
    const string = 'Иногда прошлое не хочет нас отпускать. Марджери вела веселое и беззаботное существование, пока судьба не забросила ее в Хогвартс, прямо к человеку, ' +
        'из-за которого ее жизнь когда-то разделилась на до и после. Только теперь, кроме ненависти, она начинает испытывать к нему и другое,'
    const router = useRouter();
    const ageD = ["14+", "16+", "18+"]
    const orientationD = [{name: "Гет", key:'get'},{name: "Слеш", key:'slesh'},{name: "Фемслеш", key:'femslesh'}]
    const status = ["В процессе", "Заморожено", "Завершено"]
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState('hi');
    const [genresD, stGenresD] = useState([])
    const [fandomsD, stFandomsD] = useState([])
    const [stories, setStories] = useState([])
    const [activeGenre, setActiveGenre] = useState([]);
    const [activeFandoms, setActiveFandoms] = useState([]);
    const [activeOrientation, setActiveOrientation] = useState([]);
    const [activeAge, setActiveAge] = useState([]);
    const [activeStatus, setActiveStatus] = useState([]);
    const [marks, setMarks] = React.useState([]);
    const [token, setToken] = useState('');
    const [id, setId] = useState('');
    const filter = {
        genresIds: activeGenre,
        fandomsIds: activeFandoms,
        age: activeAge,
        orientation: activeOrientation,
        status: activeStatus
    }
    let first = true;
    React.useEffect(() => {
        async function fetchMyAPI() {
            setToken(localStorage.getItem('token'));
        setId(localStorage.getItem('id'));
            if(first){
                if(localStorage.getItem('genre')){
                    setActiveGenre([...activeGenre, id])
                    const ids = [...activeGenre, id];
                    filter.genresIds = ids
                }
                if(localStorage.getItem('fandome')){
                    setActiveFandoms([...activeFandoms, id])
                    const ids = [...activeFandoms, id];
                    filter.fandomsIds = ids
                }
                first = false;
            }
            const response = await axios.get('http://localhost:9000/genres')
            stGenresD(response.data)
            const resp = await axios.get('http://localhost:9000/fandoms')
            stFandomsD(resp.data)
            const responseStory = await axios.post('http://localhost:9000/stories/get-stories/by-filters', filter)
            const story = [];
            responseStory.data.forEach(mark => {
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

    const handleClickOpen = (value: string) => {
        setOpen(true);
        setSelectedValue(value);
    };

    const handleClose = (value: string) => {
        setOpen(false);
        setSelectedValue(value);
    };
    const addGenre = async(id) => {
        if(activeGenre.includes(id)){
            activeGenre.splice(activeGenre.indexOf(id), 1)
            const ids = [...activeGenre];
            setActiveGenre([...activeGenre])
            filter.genresIds = ids
            const responseStory = await axios.post('http://localhost:9000/stories/get-stories/by-filters', filter)
            setStories(responseStory.data)

        }else {
            setActiveGenre([...activeGenre, id])
            const ids = [...activeGenre, id];
            filter.genresIds = ids
            const responseStory = await axios.post('http://localhost:9000/stories/get-stories/by-filters', filter)
            setStories(responseStory.data)
        }
    }
    const addFandom = async(id) => {
        if(activeFandoms.includes(id)){
            activeFandoms.splice(activeFandoms.indexOf(id), 1)
            const ids = [...activeFandoms];
            setActiveFandoms([...activeFandoms])
            filter.fandomsIds = ids
            const responseStory = await axios.post('http://localhost:9000/stories/get-stories/by-filters', filter)
            setStories(responseStory.data)

        }else {
            setActiveFandoms([...activeFandoms, id])
            const ids = [...activeFandoms, id];
            filter.fandomsIds = ids
            const responseStory = await axios.post('http://localhost:9000/stories/get-stories/by-filters', filter)
            setStories(responseStory.data)
        }
    }

    const addOrientation = async(id) => {
        if(activeOrientation.includes(id)){
            activeOrientation.splice(activeOrientation.indexOf(id), 1)
            const ids = [...activeOrientation];
            setActiveOrientation([...activeOrientation])
            filter.orientation = ids
            const responseStory = await axios.post('http://localhost:9000/stories/get-stories/by-filters', filter)
            setStories(responseStory.data)

        }else {
            setActiveOrientation([...activeOrientation, id])
            const ids = [...activeOrientation, id];
            filter.orientation = ids
            const responseStory = await axios.post('http://localhost:9000/stories/get-stories/by-filters', filter)
            setStories(responseStory.data)
        }
    }

    const addAge = async(id) => {
        if(activeAge.includes(id)){
            activeAge.splice(activeAge.indexOf(id), 1)
            const ids = [...activeAge];
            setActiveAge([...activeAge])
            filter.age = ids
            const responseStory = await axios.post('http://localhost:9000/stories/get-stories/by-filters', filter)
            setStories(responseStory.data)

        }else {
            setActiveAge([...activeAge, id])
            const ids = [...activeAge, id];
            filter.age = ids
            const responseStory = await axios.post('http://localhost:9000/stories/get-stories/by-filters', filter)
            setStories(responseStory.data)
        }
    }

    const addStatus = async(id) => {
        if(activeStatus.includes(id)){
            activeStatus.splice(activeStatus.indexOf(id), 1)
            const ids = [...activeStatus];
            setActiveAge([...activeStatus])
            filter.status = ids
            const responseStory = await axios.post('http://localhost:9000/stories/get-stories/by-filters', filter)
            setStories(responseStory.data)

        }else {
            setActiveStatus([...activeStatus, id])
            const ids = [...activeStatus, id];
            filter.status = ids
            const responseStory = await axios.post('http://localhost:9000/stories/get-stories/by-filters', filter)
            setStories(responseStory.data)
        }
    }
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
        <div style={{margin: '5px 0'}} className={style.section2}>
            <div style={{margin: '5px 0'}} className={style.container2}>
                <Stack spacing={3} sx={{ width: "75%", margin: "10px auto" }}>
                    <Box
                        sx={{
                            backgroundColor: "#e3e3e33d",
                            borderRadius: "10px",
                            padding: "0.5em",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexWrap: "wrap"
                        }}
                    >
                        {genresD.map(genre => {
                            return (
                                <Chip onClick={() => addGenre(genre.id)}
                                    label={genre.name}
                                    component="a"
                                    href="#basic-chip"
                                    clickable
                                    style={{margin: "1em", boxShadow: activeGenre.includes(genre.id) ? "#a01010 0px 0px 15px 0px": 'none'}}
                                />
                            )
                        })}

                        {token?<StyledChip
                            onClick={() => handleClickOpen('genres')}
                            clickable
                            style={{ margin: "0.3em"}}
                            icon={<AddIcon/>}/>:''}
                        <SimpleDialog
                            selectedValue={selectedValue}
                            open={open}
                            onClose={handleClose}
                        />
                    </Box>
                </Stack>
                <Stack spacing={3} sx={{ width: "75%", margin: "10px auto" }}>
                    <Box
                        sx={{
                            backgroundColor: "#e3e3e33d",
                            borderRadius: "10px",
                            padding: "0.5em",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexWrap: "wrap"
                        }}
                    >
                        {fandomsD.map(genre => {
                            return (
                                <Chip
                                    onClick={() => addFandom(genre.id)}
                                    label={genre.name}
                                    component="a"
                                    href="#basic-chip"
                                    clickable
                                    style={{margin: "1em", boxShadow: activeFandoms.includes(genre.id) ? "#a01010 0px 0px 15px 0px": 'none'}}
                                />
                            )
                        })}

                        {token?<StyledChip
                            onClick={() => handleClickOpen('fandoms')}
                            clickable
                            style={{ margin: "0.3em"}}
                            icon={<AddIcon/>}/>:''}
                        <SimpleDialog
                            selectedValue={selectedValue}
                            open={open}
                            onClose={handleClose}
                        />
                    </Box>
                </Stack>
                <Stack spacing={3} sx={{ width: "75%", margin: "10px auto" }}>
                    <Box
                        sx={{
                            backgroundColor: "#e3e3e33d",
                            borderRadius: "10px",
                            padding: "0.5em",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexWrap: "wrap"
                        }}
                    >
                        {ageD.map(genre => {
                            return (
                                <Chip
                                    onClick={() => addAge(genre)}
                                    label={genre}
                                    component="a"
                                    href="#basic-chip"
                                    clickable
                                    style={{margin: "1em", boxShadow: activeAge.includes(genre) ? "#a01010 0px 0px 15px 0px": 'none'}}
                                />
                            )
                        })}
                    </Box>
                </Stack>
                <Stack spacing={3} sx={{ width: "75%", margin: "10px auto" }}>
                    <Box
                        sx={{
                            backgroundColor: "#e3e3e33d",
                            borderRadius: "10px",
                            padding: "0.5em",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexWrap: "wrap"
                        }}
                    >
                        {orientationD.map(genre => {
                            return (
                                <Chip
                                    onClick={() => addOrientation(genre.key)}
                                    label={genre.name}
                                    component="a"
                                    href="#basic-chip"
                                    clickable
                                    style={{margin: "1em", boxShadow: activeOrientation.includes(genre.key) ? "#a01010 0px 0px 15px 0px": 'none'}}
                                />
                            )
                        })}
                    </Box>
                </Stack>
                <Stack spacing={3} sx={{ width: "75%", margin: "10px auto" }}>
                    <Box
                        sx={{
                            backgroundColor: "#e3e3e33d",
                            borderRadius: "10px",
                            padding: "0.5em",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexWrap: "wrap"
                        }}
                    >
                        {status.map(genre => {
                            return (
                                <Chip
                                    onClick={() => addStatus(genre)}
                                    label={genre}
                                    component="a"
                                    href="#basic-chip"
                                    clickable
                                    style={{margin: "1em", boxShadow: activeStatus.includes(genre) ? "#a01010 0px 0px 15px 0px": 'none'}}
                                />
                            )
                        })}
                    </Box>
                </Stack>
                <Box className={style.storyBlock}>
                    {stories.map(map => {
                        return (
                            <div className={classNames(style.storyOne,map.orientation === 'get' ? style.forGet : map.orientation === 'slesh' ? style.forSlesh : style.forFem)}>
                                <div className={style.imageStory} style={{cursor: 'pointer'}}><img onClick={() => router.push('/story/' + map.id)}
                                    src={"http://localhost:9000/" + map.image}/></div>
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
                                    <div className={style.descriptionSt}>
                                        {map.description}
                                    </div>
                                    <div className={style.ganresStory}>
                                        {map.genres.map((genre, index) => index < 3 ?<div style={{cursor: 'pointer'}} onClick={() => router.push('/genres/'+genre.id)}>{genre.name}</div> : '')}
                                    </div>
                                    <div className={style.readMark}>
                                        <button className={style.btn}
                                                onClick={() => router.push('/story/' + map.id)}>Читать
                                        </button>
                                        {map.isActiveMark ? <BookmarkIcon onClick={() => addMark(map.id)} sx={{color: 'red'}}/> : <BookmarkIcon onClick={() => addMark(map.id)} sx={{color: '#C9C9C9'}}/>}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </Box>
            </div>
        </div>
    );
};

export default SearchItem;