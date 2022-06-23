import React, {useState} from 'react';
import style from '../styles/Profile.module.scss'
import Avatar from "@mui/material/Avatar";
import CreateStory from "./CreateStory";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ListIcon from "@mui/icons-material/List";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import {useRouter} from "next/router";
import DialogTitle from '@mui/material/DialogTitle';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import {Button, Dialog} from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {styled} from "@mui/material/styles";
import Box from '@mui/material/Box';
import axios from "axios";
import s from '../styles/SearchItem.module.scss';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import classNames from "classnames";
import useMediaQuery from "@mui/material/useMediaQuery";
import json2mq from 'json2mq';
import TextField from "@mui/material/TextField";
import {useInput} from "../hooks/useInput";

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    selectedValue2: string;
    onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
    const {onClose, selectedValue,selectedValue2, open} = props;
    const [error, setError] = useState('')

    const handleClose = () => {
        onClose(selectedValue);
    };
    console.log(selectedValue2)
    const handleListItemClick = (value: string) => {
        onClose(value);
    };
    const message = useInput('')
    const send= async()=>{
        if(message.value.length!==0) {
            if(selectedValue2 === 'complaints') {
                await axios.post('http://localhost:9000/complaints', {
                    user: selectedValue,
                    message: message.value,
                },)
            }
            if(selectedValue2 === 'messages'){
                await axios.post('http://localhost:9000/messages/to-user/'+selectedValue, {
                    text: message.value,
                }, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
            }
            onClose('close');
        } else setError('Поля обязательные')
    }

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>{selectedValue2 === 'complaints' ? 'Пожаловаться на профиль' : 'Написать сообщение'}</DialogTitle>
            <List sx={{pt: 0}}>
                <ListItem >
                    <Typography variant="subtitle1" component="div">
                        {error}
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="subtitle1" component="div">
                        {selectedValue2 === 'complaints' ? 'Причина жалобы' : 'Сообщение'}
                    </Typography>
                </ListItem>
                <ListItem >
                    <TextField sx={{width: '100%'}} {...message}
                               error
                               id="standard-error"
                               variant="standard"
                    />
                </ListItem>
                <ListItem style={{display: 'flex', justifyContent: 'center'}} autoFocus button>
                    <Button onClick={send} style={{backgroundColor: '#FF2400',
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


const Marks = () => {
    const [marks, setMarks] = React.useState([]);

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
    return (
        <div className={s.section2} style={{margin: '5px 0'}}>
            <div className={s.container2} style={{margin: '5px 0'}}>
                <Box className={s.storyBlock}>
                    {marks.map(map => {
                        return (
                            <div className={classNames(s.storyOne,map.orientation === 'get' ? s.forGet : map.orientation === 'slesh' ? s.forSlesh : s.forFem)}>
                                <div className={s.imageStory}><img style={{cursor: 'pointer'}} onClick={() => router.push('/story/' + map.id)}
                                    src={'http://localhost:9000/'+ map.image}/></div>
                                <div className={s.descriptionStory}><h3 style={{cursor: 'pointer'}} className={style.a}
                                    onClick={() => router.push('/story/' + map.id)}>{map.name}</h3>
                                    <div className={s.likes}>
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
                                        <div style={map.status === 'Завершено' ? {background: '#C0D1C5'} : map.status === 'Заморожено' ? {background: '#D7E1F2'} : {background: '#F5BDBD'}} className={s.status}>{map.status}</div>
                                    </div>
                                    <div className={s.descriptionSt}>
                                        {map.description}
                                    </div>
                                    <div className={style.ganresStory}>
                                        {map.genres.map((genre, index) => index < 3 ?<div style={{cursor: 'pointer'}} onClick={() => router.push('/genres/'+genre.id)}>{genre.name}</div> : '')}
                                    </div>
                                    <div className={s.readMark}>
                                        <button className={style.btn}
                                                onClick={() => router.push('/story/' + map.id)}>Читать
                                        </button>
                                        <BookmarkIcon onClick={() => addMark(map.id)} sx={{color: 'red'}}/>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </Box>
            </div>
        </div>
    )
}

const Chapters = () => {
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
            const responseChapters = await axios.get('http://localhost:9000/chapters/marks/current-user', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            setChapters(responseChapters.data)
        }

        fetchMyAPI()
    }, [])

    return (
        <div className={s.section2} style={{margin: '5px 0'}}>
            <div className={s.container2} style={{margin: '5px 0'}}>
                <Box className={s.storyBlock}>
                    {chapters.map(map => {
                        return (
                            <div className={s.storyOne}>
                                <div className={s.imageStory}><img
                                    src={'http://localhost:9000/' + map.story.image}/></div>
                                <div className={s.descriptionStory}><h3
                                    onClick={() => router.push('/chapter/' + map.id)}>{map.story.name}</h3>
                                    <h3 onClick={() => router.push('/chapter/' + map.id)}>{map.name}</h3>
                                    <div className="descriptionSt" style={{maxHeight: '55%', overflow: 'hidden'}}>
                                        {map.text}
                                    </div>
                                    <div className={s.readMark}>
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
    )
}

export const MyList = ({isMyProfile, user}) => {
    const string = 'descriptionStorydescriptionStorydescriptionStorydescriptionStory'
    const router = useRouter();
    const [stories, setStories] = React.useState([]);
    let token = '';
    let id = '';

    React.useEffect(() => {
        async function fetchMyAPI() {
            token = localStorage.getItem('token');
            id = isMyProfile ? localStorage.getItem('id') : user.id;
            const response = await axios.get('http://localhost:9000/stories/by-user/' + id)
            const story = [];
            response.data.forEach(mark => {
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

    if (typeof window !== 'undefined') {
        // Perform localStorage action
        id = localStorage.getItem('id')
        token = localStorage.getItem('token');
    }
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
                    axios.get('http://localhost:9000/stories/by-user/' + user.id, {
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
                        setStories(marks)
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
                    axios.get('http://localhost:9000/stories/by-user/' + user.id, {
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
                        setStories(marks)
                    })

                })
        } else (router.push('/authorization/'))
    }
    const addChapter = (storyId) => {
        token = localStorage.getItem('token');
        id = localStorage.getItem('id');
        localStorage.setItem('idForChapter', storyId)
        if (token) {
            router.push('/chapters/create')
        }
    }
    const complete = (storyId) => {
        axios.patch('http://localhost:9000/stories/' +storyId, {status: 'Завершено'}, {
            headers: {
                Authorization: 'Bearer ' + token
            }})
            .then(resp => {
                axios.get('http://localhost:9000/stories/by-user/' + user.id, {
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
                    setStories(marks)
                })
            })
            .catch(e => console.log(e.message))
    }

    const frize = (storyId) => {
        axios.patch('http://localhost:9000/stories/' +storyId, {status: 'Заморожено'}, {
            headers: {
                Authorization: 'Bearer ' + token
            }})
            .then(resp => {
                axios.get('http://localhost:9000/stories/by-user/' + user.id, {
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
                    setStories(marks)
                })
            })
            .catch(e => console.log(e.message))
    }

    const deleteStory = (storyId) => {
        axios.delete('http://localhost:9000/stories/' +storyId,  {
            headers: {
                Authorization: 'Bearer ' + token
            }})
            .then(resp => {
                axios.get('http://localhost:9000/stories/by-user/' + user.id, {
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
                    setStories(marks)
                })
            })
            .catch(e => console.log(e.message))
    }

    return (
        <div className={s.section2} style={{margin: '5px 0'}}>
            <div className={s.container2} style={{margin: '5px 0'}}>
                <Box className={s.storyBlock}>
                    {stories.map(map => {
                        return (
                            <div className={classNames(s.storyOne,map.orientation === 'get' ? s.forGet : map.orientation === 'slesh' ? s.forSlesh : s.forFem)}>
                                <div className={s.imageStory} style={{cursor: 'pointer'}}><img onClick={() => router.push('/story/' + map.id)}
                                    src={'http://localhost:9000/' + map.image}/></div>
                                <div className={s.descriptionStory}><h3 style={{cursor: 'pointer'}} className={s.a}
                                    onClick={() => router.push('/story/' + map.id)}>{map.name}</h3>
                                    <div className={s.likes}>
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
                                        <div style={map.status === 'Завершено' ? {background: '#C0D1C5'} : map.status === 'Заморожено' ? {background: '#D7E1F2'} : {background: '#F5BDBD'}} className={s.status}>{map.status}</div>
                                    </div>
                                    <div className={s.descriptionSt}>
                                        {map.description}
                                    </div>
                                    <div className={s.ganresStory}>
                                        {map.genres.map((genre, index) => index< 3?<div style={{cursor: 'pointer'}} onClick={() => router.push('/genres/'+ genre.id)}>{genre.name}</div>:'')}
                                    </div>
                                    <div className={s.readMark}>
                                        {!isMyProfile ? '' :<DoneIcon onClick={() => complete(map.id)} sx={{cursor: 'pointer'}}/>}
                                        {!isMyProfile ? '' : <AddIcon sx={{cursor: 'pointer'}}
                                                onClick={() => addChapter(map.id)}>
                                        </AddIcon>}
                                        {/*{!isMyProfile ? '' : <EditIcon sx={{cursor: 'pointer'}}/>}*/}
                                        {!isMyProfile ? '' : <AcUnitIcon onClick={() => frize(map.id)} sx={{cursor: 'pointer'}}/>}
                                        {!isMyProfile ? '' : <DeleteIcon onClick={() => deleteStory(map.id)} sx={{cursor: 'pointer'}}/>}
                                        {!isMyProfile? <button className={style.btn}
                                                               onClick={() => router.push('/story/' + map.id)}>Читать
                                        </button> : ''}
                                        {isMyProfile ? '' : map.isActiveMark ? <BookmarkIcon onClick={() => addMark(map.id)} sx={{color: 'red'}}/> : <BookmarkIcon onClick={() => addMark(map.id)} sx={{color: '#C9C9C9'}}/>}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </Box>
            </div>
        </div>
    )
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

const Profile = ({user, isMyProfile}) => {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState('hi');
    const [selectedValue2, setSelectedValue2] = React.useState('hi');
    const matches = useMediaQuery(
        json2mq({
            minWidth: 850,
        }),
    );

    let token ='';
    if (typeof window !== 'undefined') {
        // Perform localStorage action
        token = localStorage.getItem('token');
    }
    const router = useRouter();

    const handleClickOpen = (value: string, value2: string) => {
        setOpen(true);
        setSelectedValue(value);
        setSelectedValue2(value2);
    };

    const handleClose = (value: string) => {
        setOpen(false);
        setSelectedValue(value);
    };

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <div>
            <div style={matches? {margin: '190px 0 0'}: {margin: '0'}} className={style.infoBlock}>
                <div className={style.container2}>
                    <div className={style.authorInfo}>
                        <Avatar
                            sx={{width: '150px', height: '150px'}}
                            alt="Remy Sharp"
                            src={'http://localhost:9000/'+ user.image}
                        />
                        <div style={{textAlign: 'center'}}>{user.name} {user.lastname} ({user.username})</div>
                        {isMyProfile ? <button onClick={() => router.push('/users/editProfile')}
                                               className={style.submit}>Редактировать профиль</button> : ''}
                        {!isMyProfile && token ?  <button onClick={() => handleClickOpen(user.id, 'messages')} className={style.submit}>Написать сообщение</button>:''}
                        {isMyProfile ? <div className={style.btn2}><button onClick={() => router.push('/story/create')} className={style.submit}>Создать
                            историю</button></div> : ''}
                        {isMyProfile?<div className={style.btn1}><CreateStory/></div> : ''}
                        {!isMyProfile ? <button  onClick={() => handleClickOpen(user.id, 'complaints')} className={style.submit}>Пожаловаться на
                            профиль</button> : ''}
                    </div>
                </div>
            </div>

            <div className={style.infoBlock2}>
                <div className={style.container2}>
                    <Box>
                        <BootstrapTabs
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable auto tabs example"
                        >
                            <Tab label="Истории"/>
                            {isMyProfile? <Tab label="Закладки на истории"/> : ''}
                            {isMyProfile?<Tab label="Закладки на главы"/>:''}
                        </BootstrapTabs>
                    </Box>
                    <SimpleDialog
                        selectedValue={selectedValue}
                        selectedValue2={selectedValue2}
                        open={open}
                        onClose={handleClose}
                    />
                </div>
            </div>
            {/*<Cards/>*/}
            {value === 0 ? <MyList user={user} isMyProfile={isMyProfile}/> : ''}
            {value === 1 ? <Marks/> : ''}
            {value === 2 ? <Chapters/> : ''}
        </div>
    );
};

export default Profile;