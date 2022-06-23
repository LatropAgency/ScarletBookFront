// @ts-nocheck
import React from 'react';
import style from './../styles/SearchItem.module.scss'
import {Box} from "@mui/system";
import axios from "axios";
import { useRouter } from 'next/router';

const Fandoms = ({type}) => {
    const [requests, setRequests] = React.useState([]);
    const router = useRouter();

    React.useEffect(() => {
        async function fetchMyAPI() {
            const response = await axios.get('http://localhost:9000/' + type, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            setRequests(response.data)
        }

        fetchMyAPI()
    }, [])
    return (
        <div style={{margin: '5px 0'}} className={style.section2}>
            <Box
                sx={{
                    backgroundColor: "#e3e3e39e",
                    borderRadius: "10px",
                    padding: "0.5em",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    width: '60vw'
                }}
            >
                {type==='genres'?
                    <div>
                        Список жанров с их описаниями
                    </div>
                    :
                    <div>
                        Что такое Фандом простыми словами? Фандом это сообщество фанатов чего либо. Часто они связаны общими интересами. Иногда фандом перерастает в отдельные субкультуры.
                    </div>
                }
            </Box>
            <div style={{margin: '5px 0'}} className={style.container2}>
                {requests.map(map =>{
                    return(
                        <div className={style.storyOne}>
                            <div className={style.imageStory} style={{cursor: 'pointer'}} onClick={()=> router.push('/'+type + '/'+ map.id)}><img src={"http://localhost:9000/" + map.image}/></div>
                            <div className={style.descriptionStory}><h3 className={style.a} style={{cursor: 'pointer'}} onClick={()=> router.push('/'+type + '/'+ map.id)}>{map.name}</h3>
                                <p>{map.description}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default Fandoms;