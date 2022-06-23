import React from 'react';
import style from './../../../styles/Chapter.module.scss';
import {styled} from "@mui/material/styles";
import {TextField} from '@mui/material';
import MainLayout from "./../../../layouts/MainLayout";
import {GetServerSideProps} from "next";
import axios from "axios";
import {useInput} from "./../../../hooks/useInput";
import {useRouter} from 'next/router';
import useMediaQuery from "@mui/material/useMediaQuery";
import json2mq from 'json2mq';

const BootstrapTextField = styled(TextField)(({theme}) => ({
    '& .MuiOutlinedInput-root': {
        padding: theme.spacing(2),
    },
    '& .MuiInputBase-root': {
        padding: theme.spacing(1),
    },
}));

const Create = ({chapter}) => {
    let token ='';
    let storyId = '';
    if (typeof window !== 'undefined') {
        // Perform localStorage action
        token = localStorage.getItem('token');
        storyId = localStorage.getItem('storyid');
    }
    const matches = useMediaQuery(
        json2mq({
            minWidth: 850,
        }),
    );

    let name = useInput(chapter.name)
    let text = useInput(chapter.text)
    
    const router = useRouter();
    
    const send = (is_draft) => {
        const payload = {
            "name": name.value,
            "text": text.value,
            "is_draft": is_draft
        }
        axios.patch('http://localhost:9000/chapters/' + chapter.id+'/story/'+storyId, payload, {
            headers: {
              Authorization: 'Bearer ' + token
            }})
            .then(resp => {
                router.push('/story/' + storyId);
            })
            .catch(e => console.log(e.message))
    }
    return (
        <MainLayout>
            <div style={matches? {margin: '190px 0 0'}: {margin: '0'}} className={style.section}>
                <div className={style.container2}>
                    <div className={style.infoChapters} style={{width: '100%'}}>
                        <div className={style.nameChapters} style={{width: '100%'}}>
                            <BootstrapTextField {...name} style={{height: 'auto'}} className={style.input2} sx={{width: '100%'}}
                                                placeholder='Название главы'></BootstrapTextField>
                        </div>
                        <div className={style.nameChapters} style={{width: '100%'}}>
                            <BootstrapTextField {...text} style={{height: 'auto'}} className={style.input2} sx={{width: '100%'}}
                                                multiline
                                                placeholder='Содержание'></BootstrapTextField>
                        </div>
                    </div>
                    <div className={style.buttons}>
                        <button className={style.button} onClick={() => send(false)}>Сохранить и опубликовать</button>
                        <button className={style.button} onClick={() => send(true)}>Сохранить черновик</button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Create;
export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const response = await axios.get('http://localhost:9000/chapters/' + params.id)
    return {
        props: {
            chapter: response.data
        }
    }
}