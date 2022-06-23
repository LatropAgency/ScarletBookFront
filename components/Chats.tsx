import React from 'react';
import style from '../styles/Chats.module.scss'
import {
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tab,
    Tabs,
    TextField,
    Typography
} from "@mui/material";
import {Box} from "@mui/system";
import {styled} from "@mui/material/styles";
import Messages from "./Messages";
import {useRouter} from "next/router";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";
import json2mq from 'json2mq';


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box >
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const ChatList = () => {
    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <ListItem alignItems="flex-start" sx={{bgcolor: '#BDBDBD'}}>
                <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src="../static/images/img2.jpg" />
                </ListItemAvatar>
                <ListItemText
                    primary="Brunch this weekend?"
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                Ali Connors
                            </Typography>
                            {" — I'll be in your neighborhood doing errands this…"}
                        </React.Fragment>
                    }
                />
            </ListItem>
            <Divider variant="inset" component="li" />
        </List>
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
const BootstrapTabP = styled(TabPanel)(({theme}) => ({
    '& .Mui-selected': {
        color: '#A01010!important'
    },
    '& .MuiTabs-indicator': {
        backgroundColor: '#A01010',
        height: '3px'
    },
    '& .MuiBox-root': {
        padding: '0px!important'
    }
}));

const Chats = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const matches = useMediaQuery(
        json2mq({
            minWidth: 850,
        }),
    );
    const [chats, getChats] = React.useState([]);
    const [messages, getMessages] = React.useState({});
    const [notifications, getNotifications]  = React.useState([]);
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
            const response = await axios.get('http://localhost:9000/messages/get-dialogs/curent-user', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            const responseNotif = await axios.get('http://localhost:9000/notifications', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            getNotifications(responseNotif.data)
            await axios.patch('http://localhost:9000/notifications', token, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            const messages = [];
            for (const item of response.data) {
                const response = await axios.get('http://localhost:9000/messages/get-dialog-with/'+item.id, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                messages.push({username: item.username, id: item.id, image: item.image, messages: response.data.pop()})
            }
            getChats(messages)
        }

        fetchMyAPI()
    }, [])
    const dialog = async (id, username) => {
        const response = await axios.get('http://localhost:9000/messages/get-dialog-with/'+id, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        getMessages({userId: id, username: username, messages: response.data})
        setValue(2);
    }
    return (
        <div className={style.section}>
            <div className={style.container1}>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <BootstrapTabs style={matches? {margin: '70px 0 0'}: {margin: '0'}} sx={{padding:'0'}} value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Сообщения" {...a11yProps(0)} />
                            <Tab label="Уведомления" {...a11yProps(1)} />
                            {value === 2? <Tab label="Диалог" {...a11yProps(2)} /> : ''}
                        </BootstrapTabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        {chats.map(chat =>{
                            const is_read = chat.messages.is_read ?'fff':'#BDBDBD';
                            const color = {bgcolor: is_read}
                            return(
                                <List sx={{ width: '100%', bgcolor: 'background.paper', cursor: 'pointer' }} onClick={() => dialog(chat.id, chat.username)}>
                                    <ListItem alignItems="flex-start" sx={color}>
                                        <ListItemAvatar>
                                            <Avatar  alt="Remy Sharp" src={"http://localhost:9000/" + chat.image} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={chat.username}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {chat.messages.text}
                                                        <br/>
                                                    </Typography>
                                                    {new Date(chat.messages.createdAt).getDate()}-{new Date(chat.messages.createdAt).getMonth()}-{new Date(chat.messages.createdAt).getFullYear()}
                                                    {' ' + new Date(chat.messages.createdAt).getHours()}:{new Date(chat.messages.createdAt).getMinutes()}
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </List>
                            )
                        })}
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        {notifications.map(chat =>{
                            const is_read = chat.is_read ?'fff':'#BDBDBD';
                            const color = {bgcolor: is_read}
                            return(
                                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                    <ListItem alignItems="flex-start" sx={color}>
                                        <ListItemText
                                            primary={new Date(chat.createdAt).getDate()+ '-'+new Date(chat.createdAt).getMonth()+ '-' + new Date(chat.createdAt).getFullYear()
                                                +' ' + new Date(chat.createdAt).getHours()+':'+new Date(chat.createdAt).getMinutes()}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {chat.text}
                                                    </Typography>

                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </List>
                            )
                        })}
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Messages dialog={messages}/>
                    </TabPanel>
                </Box>
            </div>
        </div>
    );
};

export default Chats;