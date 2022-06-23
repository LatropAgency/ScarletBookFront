import React from 'react';
import style from '../styles/SearchItem.module.scss'
import {Box} from "@mui/system";
import axios from "axios";
import {TextField} from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {useRouter} from "next/router";
import useMediaQuery from "@mui/material/useMediaQuery";
import json2mq from 'json2mq';

const SearchItems = () => {
    const [query, setQuery] = React.useState('')
    const [timer, setTimer] = React.useState(null)
    const [data, setData] = React.useState([{users:[]},{userfullname:[]}, {stories:[]}])
    const router = useRouter();

    const search = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
        console.log(e.target.value)
        if (timer)
            clearTimeout(timer)
        setTimer(
            setTimeout(() => {
                const newData = [{users:[]},{userfullname:[]}, {stories:[]}]
                axios.post('http://localhost:9000/users/find-users/username',
                    {username: e.target.value}
                ).then(resp => {
                    newData[0].users=resp.data;
                    axios.post('http://localhost:9000/users/find-users/fullname',
                        {fullname: e.target.value}
                    ).then(resp => {
                        newData[1].userfullname=resp.data
                        axios.post('http://localhost:9000/stories/by-storyname/name',
                            {name: e.target.value}
                        ).then(resp => {
                            newData[2].stories=resp.data
                            setData(newData)
                        })
                    })
                })

            }, 500)
        )
    }
    return (
        <div style={{margin: '5px 0'}} className={style.section2}>
            <div style={{margin: '5px 0'}} className={style.container2}>
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <TextField sx={{width: '75%', display: 'flex'}}
                               error
                               id="standard-error"
                               variant="standard"
                               label={'Поиск'}
                               value={query}
                               onChange={search}
                    />
                </div>

                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    <h3 style={{textAlign: 'center'}}>Пользователи</h3>
                    {data[0].users.map(map =>{
                        return(
                            <ListItem style={{cursor: 'pointer'}} alignItems="flex-start" onClick={()=>router.push('/users/'+map.id)}>
                                <ListItemAvatar>
                                    <Avatar alt="Remy Sharp" src={"http://localhost:9000/" + map.image} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={map.username}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="#4D4D4D"
                                            >
                                                {map.name} {map.lastname}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                                <Divider variant="inset" component="li" />
                            </ListItem>
                        )
                    })}
                    {data[1].userfullname.map(map =>{
                        return(
                            <ListItem style={{cursor: 'pointer'}} alignItems="flex-start" onClick={()=>router.push('/users/'+map.id)}>
                                <ListItemAvatar>
                                    <Avatar alt="Remy Sharp" src={"http://localhost:9000/" + map.image} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={map.username}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="#4D4D4D"
                                            >
                                                {map.name} {map.lastname}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                                <Divider variant="inset" component="li" />
                            </ListItem>
                        )
                    })}
                    <h3 style={{textAlign: 'center'}}>Истории</h3>
                    {data[2].stories.map(map =>{
                        return(
                            <ListItem style={{cursor: 'pointer'}} alignItems="flex-start" onClick={()=>router.push('/story/'+map.id)}>
                                <ListItemAvatar>
                                    <Avatar alt="Remy Sharp" src={"http://localhost:9000/" + map.image} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={map.name}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="#4D4D4D"
                                            >
                                                {map.description}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                                <Divider variant="inset" component="li" />
                            </ListItem>
                        )
                    })}
                </List>
            </div>
        </div>
    );
};

export default SearchItems;