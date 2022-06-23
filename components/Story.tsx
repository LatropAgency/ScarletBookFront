// @ts-nocheck
import React, {useEffect, useState} from 'react';
import style from './../styles/SearchItem.module.scss'
import FavoriteIcon from "@mui/icons-material/Favorite";
import ListIcon from "@mui/icons-material/List";
import {Button} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import {useRouter} from "next/router";
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import Comments from './Comments';
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import useMediaQuery from "@mui/material/useMediaQuery";
import json2mq from 'json2mq';

const Story = ({story}) => {
    const matches = useMediaQuery(
        json2mq({
            minWidth: 850,
        }),
    );
    const [chapters, setChapters] = React.useState([])
    const router = useRouter()
    let isMyStory = false;
    const [like, setLike] = React.useState({isActive: false, count: 0});
    const [marks, setMarks] = React.useState({isActive: false});

    let token = '';
    let id = '';
    let img = ''
    if (typeof window !== 'undefined') {
        // Perform localStorage action
        id = localStorage.getItem('id')
        isMyStory = id === story.user.id;
        token = localStorage.getItem('token');
        img = localStorage.getItem('img');
    }

    React.useEffect(() => {
        async function fetchMyAPI() {

            const id = localStorage.getItem('id')
            const isMyStory = id === story.user.id ? 1 : 0;
            const response = await axios.get('http://localhost:9000/chapters/storyId/' + story.id + '?isMystory='+isMyStory)
            const chapters = [];
            response.data.forEach(mark => {
                const find = mark.likes.find((like) => like.id === id);
                mark = {...mark, isActiveLike: find ? true : false, count: mark.likes.length}
                const find2 = mark.marks.find((mark) => mark.id === id);
                mark = {...mark, isActiveMark: find2 ? true : false}
                chapters.push(mark);
            })
            setChapters(chapters)
            if (token) {
                axios.get('http://localhost:9000/stories/' + story.id + '/likeInfo', {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                    .then(resp => {
                        setLike(resp.data);
                    })
                    .catch(e => console.log(e.message))
                axios.get('http://localhost:9000/stories/' + story.id + '/markInfo', {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                    .then(resp => {
                        setMarks(resp.data);
                    })
                    .catch(e => console.log(e.message))
            }
        }

        fetchMyAPI()
    }, [])

    const addLike = () => {
        if (token) {
            // @ts-ignore
            axios.get('http://localhost:9000/stories/' + story.id + '/like', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(resp => {
                    // @ts-ignore
                    axios.get('http://localhost:9000/stories/' + story.id + '/likeInfo', {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    })
                        .then(resp => {
                            setLike(resp.data);
                        })
                })
        } else (router.push('/authorization/'))
    }

    const addMark = () => {
        if (token) {
            // @ts-ignore
            axios.get('http://localhost:9000/stories/' + story.id + '/mark', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(resp => {
                    // @ts-ignore
                    axios.get('http://localhost:9000/stories/' + story.id + '/markInfo', {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    })
                        .then(resp => {
                            setMarks(resp.data);
                        })
                })
        } else (router.push('/authorization/'))
    }

    const addLikeChapter = (chapterId) => {
        token = localStorage.getItem('token');
        id = localStorage.getItem('id');
        if (token) {
            axios.get('http://localhost:9000/chapters/' + chapterId + '/like', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(resp => {
                    axios.get('http://localhost:9000/chapters/storyId/' + story.id).then(resp => {
                        const chapters = [];
                        resp.data.forEach(mark => {
                            const find = mark.likes.find((like) => like.id === id);
                            mark = {...mark, isActiveLike: find ? true : false, count: mark.likes.length}
                            const find2 = mark.marks.find((mark) => mark.id === id);
                            mark = {...mark, isActiveMark: find2 ? true : false}
                            chapters.push(mark);
                        })
                        setChapters(chapters)
                    })
                })
        } else (router.push('/authorization/'))
    }

    const addMarkChapter = (chapterId) => {
        token = localStorage.getItem('token');
        id = localStorage.getItem('id');
        if (token) {
            axios.get('http://localhost:9000/chapters/' + chapterId + '/mark', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(resp => {
                    axios.get('http://localhost:9000/chapters/storyId/' + story.id).then(resp => {
                        const chapters = [];
                        resp.data.forEach(mark => {
                            const find = mark.likes.find((like) => like.id === id);
                            mark = {...mark, isActiveLike: find ? true : false, count: mark.likes.length}
                            const find2 = mark.marks.find((mark) => mark.id === id);
                            mark = {...mark, isActiveMark: find2 ? true : false}
                            chapters.push(mark);
                        })
                        setChapters(chapters)
                    })
                })
        } else (router.push('/authorization/'))
    }

    const deleteChapter = (id, storyId) => {
        axios.delete('http://localhost:9000/chapters/' + id + '/story/' + storyId,  {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(resp => {
                axios.get('http://localhost:9000/chapters/storyId/' + story.id).then(resp => {
                    const chapters = [];
                    resp.data.forEach(mark => {
                        const find = mark.likes.find((like) => like.id === id);
                        mark = {...mark, isActiveLike: find ? true : false, count: mark.likes.length}
                        const find2 = mark.marks.find((mark) => mark.id === id);
                        mark = {...mark, isActiveMark: find2 ? true : false}
                        chapters.push(mark);
                    })
                    setChapters(chapters)
                })
            })
            .catch(e => error(e.message))
    }

    const publish = (id, storyId) => {
        axios.patch('http://localhost:9000/chapters/'+ id+ '/story/'+storyId,  {is_draft: false},{
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(resp => {
                axios.get('http://localhost:9000/chapters/storyId/' + story.id,
                    {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    }
                    ).then(resp => {
                    const chapters = [];
                    resp.data.forEach(mark => {
                        const find = mark.likes.find((like) => like.id === id);
                        mark = {...mark, isActiveLike: find ? true : false, count: mark.likes.length}
                        const find2 = mark.marks.find((mark) => mark.id === id);
                        mark = {...mark, isActiveMark: find2 ? true : false}
                        chapters.push(mark);
                    })
                    setChapters(chapters)
                })
            })
            .catch(e => error(e.message))
    }

    const save = async () => {
        axios({
            url: 'http://localhost:9000/stories/' + story.id + '/reports', //your url
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', story.name + '.pdf'); //or any other extension
            document.body.appendChild(link);
            link.click();
        });

    }
    const el = React.createRef();
    const [height, setH] = useState(40);

    useEffect(() => setH(el.current.offsetHeight));
    return (
        <div>
            <div className={style.section11} >
                <div className={style.container1}  style={matches? {margin: '100px 0 0'}: {margin: '0'}}>
                    <img style={{height: height + 'px'}} className={style.imageStory2} src={'http://localhost:9000/' + story.image}/>
                    <div ref={el} style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '50%'}}>
                        <div className={style.storyDescription}>
                            <h1>{story.name}</h1>
                            <div style={{margin: '15px 0'}} className={style.likes}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: '0 15px 0 0'
                                }}>{like.isActive ?
                                    <FavoriteIcon onClick={addLike} sx={{color: 'red', cursor: 'pointer', fontSize: '1.3rem', margin: '0 7px 0 0'}}/> :
                                    <FavoriteIcon onClick={addLike} sx={{color: '#C9C9C9', cursor: 'pointer', fontSize: '1.3rem', margin: '0 7px 0 0'}}/>}
                                    <div style={{fontSize: '10pt'}}>{like.count}</div>
                                </div>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: '0 8px 0 0'
                                }}><ListIcon sx={{color: '#C9C9C9', fontSize: '1.7rem', margin: '0 7px 0 0'}}/>
                                    <div style={{fontSize: '10pt'}}>{chapters.length}</div>
                                </div>
                            </div>
                            <div style={{margin: '15px 0'}} className={style.author}>
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <img style={{cursor: 'pointer'}} onClick={() => router.push(`/users/${story.user.id}`)} src={'http://localhost:9000/' + story.user.image}/>
                                <p style={{margin: '0', fontSize: '14pt', cursor: 'pointer'}} onClick={() => router.push(`/users/${story.user.id}`)}>{story.user.name}</p>
                                </div>
                                <div style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center'}}>
                                    <p style={{margin: '0', fontSize: '10pt'}}>Опубликовано: </p>
                                    <p style={{margin: '0', fontSize: '10pt'}}>{new Date(story.createdAt).getDate()}-{new Date(story.createdAt).getMonth()}-{new Date(story.createdAt).getFullYear()}</p>
                                </div>
                                <div style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center'}}>
                                    <p style={{margin: '0', fontSize: '10pt'}}>Изменено: </p>
                                    <p style={{margin: '0', fontSize: '10pt'}}>{new Date(story.modifiedAt).getDate()}-{new Date(story.modifiedAt).getMonth()}-{new Date(story.modifiedAt).getFullYear()}</p>
                                </div>
                            </div>
                            <div style={{margin: '15px 0', fontSize: '14pt', maxHeight: '172px', overflow:'hidden'}} className={style.description}>
                                {story.description}
                            </div>
                            <div style={{margin: '15px 0'}} className={style.likes}>
                                <div style={story.status === 'Завершено' ? {background: '#C0D1C5'} : story.status === 'Заморожено' ? {background: '#D7E1F2'} : {background: '#F5BDBD'}} className={style.status}>{story.status}</div>
                            </div>
                            <div style={{margin: '15px 0'}} className={style.ganresStory}>
                                {story.genres.map(genre => <div style={{cursor: 'pointer'}} onClick={() => router.push('/genres/'+ genre.id)}>{genre.name}</div>)}
                            </div>
                        </div>
                        <div style={{paddingLeft: '20px', margin:'0'}} className={style.read}>
                            <button onClick={save} className={style.btn}>Скачать</button>
                            {marks.isActive ? <BookmarkIcon onClick={addMark} sx={{color: 'red', cursor: 'pointer'}}/> :
                                <BookmarkIcon onClick={addMark} sx={{color: '#C9C9C9', cursor: 'pointer'}}/>}
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.section3}>
                <div className={style.container2} style={{margin: '10px 0'}}>
                    <div style={{fontSize: '18pt', margin: '20px 0 0 0'}} className={style.description}>
                        {story.description}
                    </div>
                </div>
            </div>
            <div className={style.section3}>
                <div className={style.container2} style={{margin: '10px 0'}}>
                    <div className={style.contents}>
                        <div className={style.chapters}>Оглавление</div>
                        <hr className={style.hr}/>
                        {chapters.map(chapter => {
                            return (
                                <>
                                    <div className={style.chapter}>
                                        <p style={{cursor: 'pointer'}}
                                           onClick={() => router.push('/chapters/' + chapter.id)}>{chapter.name}</p>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}>
                                            {chapter.isActiveMark ?
                                                <BookmarkIcon onClick={() => addMarkChapter(chapter.id)}
                                                              sx={{color: 'red', cursor: 'pointer'}}/> :
                                                <BookmarkIcon onClick={() => addMarkChapter(chapter.id)}
                                                              sx={{color: '#C9C9C9', cursor: 'pointer'}}/>}
                                            {isMyStory ? <EditIcon onClick={() => {
                                                router.push('/chapters/edit/' + chapter.id);
                                                localStorage.setItem('storyid', story.id)
                                            }} sx={{color: '#C9C9C9', cursor: 'pointer'}}/> : ''}
                                            {isMyStory && chapter.is_draft ? <PublishIcon onClick={() => publish(chapter.id, story.id)}
                                                                      sx={{color: '#C9C9C9', cursor: 'pointer'}}/> : ''}
                                            {isMyStory ? <DeleteIcon onClick={() => deleteChapter(chapter.id, story.id)} sx={{color: '#C9C9C9', cursor: 'pointer'}}/> : ''}
                                            {chapter.isActiveLike ?
                                                <FavoriteIcon onClick={() => addLikeChapter(chapter.id)}
                                                              sx={{color: 'red', cursor: 'pointer'}}/> :
                                                <FavoriteIcon onClick={() => addLikeChapter(chapter.id)}
                                                              sx={{color: '#C9C9C9', cursor: 'pointer'}}/>}
                                            <div>{chapter.count}</div>
                                        </div>
                                    </div>
                                    <hr/>
                                </>
                            )
                        })}
                    </div>
                </div>
            </div>
            <Comments comments={story.comments} userId={id} storyId={story.id} forStory={true}/>
        </div>
    );
};

export default Story;

