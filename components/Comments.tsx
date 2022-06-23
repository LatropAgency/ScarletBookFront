import React, {useState} from 'react';
import style from '../styles/Comments.module.scss'
import axios from "axios";
import {useInput} from "../hooks/useInput";
import {useRouter} from 'next/router';
import {TextField} from "@mui/material";

const Comments = ({comments, userId, storyId, forStory}) => {
    const [commentsVal, setComments] = React.useState(comments)
    let text = useInput('')
    const [input, setInput] = useState('');
    const router = useRouter()
    let token = '';
    let img = ''
    if (typeof window !== 'undefined') {
        // Perform localStorage action
        token = localStorage.getItem('token')
        img = localStorage.getItem('img')
    }
    const sendComments = () => {
        const payload = {
            "story": storyId,
            "text": input,
            "chapter": storyId
        }
        setInput('');
        const url = forStory ? 'http://localhost:9000/comments/create/forStory' : 'http://localhost:9000/comments/create/forChapter';
        const url2 = forStory ? 'http://localhost:9000/stories/' : 'http://localhost:9000/chapters/';
        axios.post(url, payload, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(resp => {
                axios.get(url2 + storyId).then(resp => {
                    setComments(resp.data.comments);
                    setInput('')
                })
            })
            .catch(e => console.log(e.message))
    }
    const deleteComment = (id) => {

        const url = forStory ? 'http://localhost:9000/comments/forStory/commentID/' : 'http://localhost:9000/comments/forChapter/commentID/';
        const url2 = forStory ? 'http://localhost:9000/stories/' : 'http://localhost:9000/chapters/';
        axios.delete(url + id,  {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(resp => {
                axios.get(url2 + storyId).then(resp => {
                    setComments(resp.data.comments);

                })
            })
            .catch(e => console.log(e.message))
    }
    return (
        <div className={style.section}>
            <div className={style.container2}>
                <div>
                    {userId ?
                        <div className={style.info}>
                            <div className={style.infoUser}>
                                <div className={style.userPhoto}><img className={style.userPhoto}
                                                                      src={'http://localhost:9000/' + img}/>
                                </div>
                                <div><textarea value={input} onChange={e => setInput(e.target.value)} className={style.textComment} name="text"/></div>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'end'}} className={style.send}><input
                                onClick={sendComments} type="submit" value="Отправить"/></div>
                        </div>
                        : ''}
                    {commentsVal.map(comment => {
                        return (
                            <div className={style.comments}>
                                <div className={style.infoComment}><img className={style.userPhoto}
                                                                        src={'http://localhost:9000/'+ comment.user.image}/>
                                    <div className={style.commentAttribute}>
                                        <div className={style.userCom}>{comment.user.username}</div>
                                        <div style={{fontSize: '10pt'}} className={style.date}>{new Date(comment.createdAt).getDate()+ '-'+new Date(comment.createdAt).getMonth()+ '-' + new Date(comment.createdAt).getFullYear()
                                            +' ' + new Date(comment.createdAt).getHours()+':'+new Date(comment.createdAt).getMinutes()}</div>
                                        <p className={style.textCommentClass}>{comment.text}</p>
                                        <div>
                                            {comment.user.id === userId ?
                                                <button style={{cursor: 'pointer'}} onClick={() => deleteComment(comment.id)} className={style.commentBtn}>Удалить</button> : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}


                    {/* <div className={style.com2}>
                        <div className={style.infoComment}>
                            <img className={style.userPhoto} src='https://picsum.photos/800/305/?random'/>
                            <div className={style.commentAttribute}>
                                <div className={style.userCom}>Veronika<span className={style.answer}> ответил(а) Vova</span></div>
                                <div className={style.date}>10.04.2022</div>
                                <p className={style.textCommentClass}>hi</p>
                                <div>
                                    <button className={style.commentBtn}>Ответить</button>
                                    <button className={style.commentBtn}>Удалить</button>
                                </div>
                            </div>
                        </div>
                    </div> */}

                </div>
            </div>
        </div>
    );
};

export default Comments;