// @ts-nocheck
import React, {useEffect, useRef, useState} from 'react';
import style from './../styles/Chats.module.scss';
import {styled} from "@mui/material/styles";
import {TextField} from "@mui/material";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";
import {useInput} from "./../hooks/useInput";

const BootstrapTextField = styled(TextField)(({theme}) => ({
    '& .MuiOutlinedInput-root': {
        padding: theme.spacing(2),
    },
    '& .MuiInputBase-root': {
        padding: theme.spacing(1),
    },
}));

const Messages = (dialog) => {
    const divRef = useRef(null);
    const [d, setD] = useState(dialog)
    const [mess, setMess] = useState('')
    let token = '';
    const [id, setId] = useState('')
    console.log(dialog)

    useEffect(() => {
        token = localStorage.getItem('token');
        setId(localStorage.getItem('id'));
        divRef.current.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
        axios.patch('http://localhost:9000/messages/chat/' + dialog.dialog.userId, token, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
    });
    const message = useInput('')
    const send = async () =>{
        await axios.post('http://localhost:9000/messages/to-user/'+dialog.dialog.userId, {
            text: mess,
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        setMess('')
        const response = await axios.get('http://localhost:9000/messages/get-dialog-with/'+dialog.dialog.userId, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        setD({dialog:{userId: id,  messages: response.data}})
    }
    // @ts-ignore
    return (
        <div style={{width: '100%', display: 'flex', alignItems: 'center', flexDirection:'column'}}>
            <div id='bottom' style={{width: '90%', height: '70vh', overflow: 'scroll'}}>
                {d.dialog.messages.map(map => {
                    return(
                        <div>
                        <div className={map.to_user_id.id === id ? style.messageFrom : style.myMessage}>
                            <p>{map.text}</p>
                        </div>
                            <div className={map.to_user_id.id === id ? style.messageFrom : style.myMessage} style={{fontSize: '9pt', background: 'none'}}>{new Date(map.createdAt).getDate()+ '-'+new Date(map.createdAt).getMonth()+ '-' + new Date(map.createdAt).getFullYear()
                                +' ' + new Date(map.createdAt).getHours()+':'+new Date(map.createdAt).getMinutes()}</div>
                        </div>
                    )
                })}

                <div ref={divRef} />
            </div>
            <div className={style.message} style={{width: '90%'}}>
                <BootstrapTextField value={mess} onChange={(e) => setMess(e.target.value)} sx={{background: '#B1B1B1'}} className={style.input} multiline
                                    rows={2}/>
                <div onClick={send}>
                    <SendIcon  fontSize='large' sx={{color: '#FF2400', margin: '5px', cursor: 'pointer'}}/>
                </div>
            </div>
        </div>
    );
};

export default Messages;