// @ts-nocheck
import React from 'react';
import style from './../../styles/Chapter.module.scss';
import {styled} from "@mui/material/styles";
import {TextField} from '@mui/material';
import MainLayout from "./../../layouts/MainLayout";
import {useInput} from "./../../hooks/useInput";
import axios from "axios";
import { useRouter } from 'next/router';
import useMediaQuery from "@mui/material/useMediaQuery";
import json2mq from 'json2mq';

const BootstrapTextField = styled(TextField)(({theme}) => ({
    '& .MuiOutlinedInput-root': {
        padding: theme.spacing(2),
        fontSize: '14pt'
    },
    '& .MuiInputBase-root': {
        padding: theme.spacing(1),
        fontSize: '14pt'
    },
}));

const Create = () => {
    const [value, setValue] = React.useState(0);
    const matches = useMediaQuery(
        json2mq({
            minWidth: 850,
        }),
    );
    const name = useInput('')
    const text = useInput('')
    const router = useRouter();
    let idForChapter ='';
    if (typeof window !== 'undefined') {
        // Perform localStorage action
        idForChapter = localStorage.getItem('idForChapter');
    }

    const send = (is_draft) =>{
        const payload = {
            name: name.value,
            text: text.value,
            is_draft: is_draft,
            story: idForChapter
        }

        axios.post('http://localhost:9000/chapters', payload, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(resp => {
                router.push('/story/' + localStorage.getItem('idForChapter'));
                localStorage.setItem('idForChapter', '');
                console.log(localStorage.getItem('token'))
            })
            .catch(e => error(e.message))
    }
    return (
        <MainLayout>
            <div className={style.section}>
                <div className={style.container2} style={matches? {margin: '100px 0 0'}: {margin: '0'}}>
                    <div className={style.infoChapters} style={{width: '100%'}}>
                        <div className={style.nameChapters} style={{width: '100%'}}>
                            <BootstrapTextField {...name} style={{height: 'auto'}} className={style.input2} sx={{width: '100%'}}
                                                placeholder='Название главы'/>
                        </div>
                        <div className={style.nameChapters} style={{width: '100%'}}>
                            <BootstrapTextField {...text} style={{height: 'auto'}} className={style.input2} sx={{width: '100%'}}
                                                multiline
                                                placeholder='Содержание'/>
                        </div>
                    </div>
                    <div className={style.buttons}>
                        <button onClick={() => send(false)} className={style.button}>Сохранить и опубликовать</button>
                        <button onClick={() => send(true)} className={style.button}>Сохранить черновик</button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Create;