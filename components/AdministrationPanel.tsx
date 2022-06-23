import React, {useEffect, useRef, useState} from 'react';
import style from "./../styles/Chats.module.scss";
import {Box} from "@mui/system";
import {
    Button,
    Collapse,
    Dialog,
    IconButton,
    Menu,
    MenuItem,
    Tab,
    TablePagination,
    Tabs,
    TextField,
    Typography
} from "@mui/material";
import Messages from "./Messages";
import {styled} from "@mui/material/styles";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {useInput} from "./../hooks/useInput";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import {useRouter} from "next/router";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BlockIcon from '@mui/icons-material/Block';
import useMediaQuery from "@mui/material/useMediaQuery";
import json2mq from 'json2mq';
import classNames from "classnames";

const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#A01010',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({}));

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
) {
    return {name, calories, fat, carbs, protein};
}


export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    selectedValue2: string;
    onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
    const { onClose, selectedValue, selectedValue2, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };
    const [error, setError] = useState('')

    const handleListItemClick = (value: string) => {
        onClose(value);
    };
    let token;
    const name = useInput('')
    const send = async (value: string) => {
        if(name.value.length!==0) {
            token = localStorage.getItem('token');
            const payload = {
                user: selectedValue, text: 'Дублирование' + name.value
            }
            if (token) {
                axios.post('http://localhost:9000/notifications', payload,{
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                    .then(resp => {

                                axios.delete('http://localhost:9000/requests/'+selectedValue2, {
                                    headers: {
                                        Authorization: 'Bearer ' + token
                                    }
                                })

                    })
            }
            onClose(value);
        } else setError('Поля обязательные')
    }

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Дублирование</DialogTitle>
            <List sx={{ pt: 0 }}>
                <ListItem >
                    <Typography variant="subtitle1" component="div">
                        {error}
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="subtitle1" component="div">
                        Сообщение
                    </Typography>
                </ListItem>
                <ListItem >
                    <TextField
                        {...name}
                        error
                        id="standard-error"
                        variant="standard"
                    />
                </ListItem>
                <ListItem>
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
const Complaints = () => {
    const [requests, setRequests] = React.useState([]);
    const router = useRouter();

    React.useEffect(() => {
        async function fetchMyAPI() {
            const response = await axios.get('http://localhost:9000/complaints', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            setRequests(response.data)
        }

        fetchMyAPI()
    }, [])
    const blockUser = async (userId) =>{
        const responseBlock = await axios.post('http://localhost:9000/block-users', {user: userId, message: 'Заблокированы за большое количество жалоб', expireDate: Date.now()},{
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        const response = await axios.get('http://localhost:9000/complaints', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        setRequests(response.data)
    }
    const [open, setOpen] = React.useState(false);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div>
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell />
                        <StyledTableCell>Фото</StyledTableCell>
                        <StyledTableCell>Имя пользователя</StyledTableCell>
                        <StyledTableCell>Статус</StyledTableCell>
                        <StyledTableCell>Количество жалоб</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <React.Fragment>
                            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                <TableCell>
                                    <IconButton
                                        aria-label="expand row"
                                        size="small"
                                        onClick={() => setOpen(!open)}
                                    >
                                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    </IconButton>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <img style={{height: '50px', width: '50px', objectFit:'cover', borderRadius:'50%'}} src={'http://localhost:9000/'+row.image} alt=""/>
                                </TableCell>
                                <TableCell>{row.username}</TableCell>
                                <TableCell>{row.is_banned? 'заблокирован': 'не заблокирован'}</TableCell>
                                <TableCell align="center">{row.complaint.length}</TableCell>
                                <TableCell><BlockIcon onClick={() => blockUser(row.id)}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                        <Box sx={{ margin: 1 }}>
                                            <Typography variant="h6" gutterBottom component="div">
                                                Жалобы
                                            </Typography>
                                            <Table size="small" aria-label="purchases">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Дата</TableCell>
                                                        <TableCell>Сообщение</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {row.complaint.map((historyRow) => (
                                                        <TableRow key={historyRow.id}>
                                                            <TableCell component="th" scope="row">
                                                                {historyRow.createdAt}
                                                            </TableCell>
                                                            <TableCell>{historyRow.message}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Box>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={requests.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    )
}
const Admins= () => {
    const [requests, setRequests] = React.useState([]);
    const router = useRouter();

    React.useEffect(() => {
        async function fetchMyAPI() {
            const response = await axios.get('http://localhost:9000/users', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            setRequests(response.data)
        }

        fetchMyAPI()
    }, [])
    const changeRoles = async (role, userId) => {
         axios.patch('http://localhost:9000/users/' + userId +'/change-role/'+role, {},{
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
             axios.get('http://localhost:9000/users', {
                 headers: {
                     Authorization: 'Bearer ' + localStorage.getItem('token')
                 }
             }).then(response => setRequests(response.data))
         })
    }


    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div>
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 700}} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Фото</StyledTableCell>
                        <StyledTableCell>Имя пользователя</StyledTableCell>
                        <StyledTableCell>Роль</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                        <StyledTableRow key={row.name}>
                            <StyledTableCell component="th" scope="row">
                                <img style={{height: '100px', width: '100px', objectFit:'cover', borderRadius:'50%'}} src={'http://localhost:9000/' + row.image} alt=""/>
                            </StyledTableCell>
                            <StyledTableCell onClick={() => router.push('/users/' + row.id)}>{row.username}</StyledTableCell>
                            <StyledTableCell>{row.role === 'ADMIN' || row.role === 'SUPER_ADMIN'? 'Администратор' : 'Пользователь'}</StyledTableCell>
                            <StyledTableCell>
                                {row.role === 'ADMIN' || row.role === 'SUPER_ADMIN'? <DeleteIcon onClick={() => changeRoles('USER', row.id)}/>: <AddIcon onClick={() => changeRoles('ADMIN', row.id)}/>}
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={requests.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}
const Fandoms= ({type}) => {
    const [requests, setRequests] = React.useState([]);
    const [photo, setPhoto] = useState(null)
    const [photo2, setPhoto2] = useState(null)

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const onMainPhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length) {
            setPhoto(e.target.files[0]);
            setPhoto2(URL.createObjectURL(e.target.files[0]));
        }
    }
    React.useEffect(() => {
        async function fetchMyAPI() {
            const response = await axios.get('http://localhost:9000/'+ type, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            setRequests(response.data)
        }

        fetchMyAPI()
    }, [])
    const [value, setValue] = React.useState(null);


    const valueName = useRef('')
    const valueDescription = useRef('')

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const edit = (nameEdit, descriptionEdit) =>{
        valueName.current = nameEdit
        valueDescription.current =descriptionEdit
        setName(nameEdit)
        setDescription(descriptionEdit)
        setValue(nameEdit)
    }
    const saveFields = (id) =>{
        const formData = new FormData()
        // @ts-ignore
        formData.append('name', valueName.current.value)
        // @ts-ignore
        formData.append('description', valueDescription.current.value)
        console.log(photo)
        // @ts-ignore
        if(photo === '' && valueName.current.value !== '' && valueDescription.current.value !== ''){
            const payload = {
                // @ts-ignore
                name: valueName.current.value,
                // @ts-ignore
                description: valueDescription.current.value
            }
            axios.patch('http://localhost:9000/'+ type+'/'+id, payload,{
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(resp => {
                axios.get('http://localhost:9000/'+ type, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(resp => setRequests(resp.data))

            })
        }
        // @ts-ignore
        if(photo !== '' && valueName.current.value !== '' && valueDescription.current.value !== ''){
            formData.append('image', photo)
            axios.patch('http://localhost:9000/'+ type+'/'+id+ '/update-with-image', formData,{
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(resp => {
                axios.get('http://localhost:9000/'+ type, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(resp => setRequests(resp.data))

            })
        }

        setPhoto('')
        setValue(null)
    }
    const deleteItem = (id) => {
        axios.delete('http://localhost:9000/'+ type+'/'+id,{
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            axios.get('http://localhost:9000/'+ type, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(resp => setRequests(resp.data))

        })
    }
    return (
        <div>
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 700}} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Название</StyledTableCell>
                        <StyledTableCell>Описание</StyledTableCell>
                        <StyledTableCell>Картинка</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <StyledTableRow key={row.id}>
                            <StyledTableCell component="th" scope="row">
                                {value === row.name ? <TextField inputRef={valueName} id="standard-basic" variant="standard" error defaultValue={row.name}/> : row.name}
                            </StyledTableCell>
                            <StyledTableCell>{value === row.name ? <TextField inputRef={valueDescription} id="standard-basic" variant="standard" error defaultValue={row.description}/> :row.description}</StyledTableCell>
                            <StyledTableCell>{value === row.name ? <div style={{cursor: 'pointer'}} className={style.example2}>
                                <div style={{cursor: 'pointer'}} className={style.formGroup}>
                                    <input style={{cursor: 'pointer'}} onChange={onMainPhotoSelected} type="file" name="file" id="file"
                                           className={style.inputFile}/>
                                    <label style={{width: '100%', cursor: 'pointer'}} htmlFor="file" id="center"
                                           className={classNames(style.input, style.label)}>
                                        <FileUploadIcon fontSize='small'/>
                                    </label>
                                </div>
                            </div> :<img style={{height: '100px', width: '100px', objectFit:'cover'}} src={'http://localhost:9000/' + row.image} alt=""/>}</StyledTableCell>
                            <StyledTableCell>
                                {value !== row.name ?<EditIcon style={{cursor: 'pointer'}} onClick={() => edit(row.name, row.description)}/>:<DoneIcon style={{cursor: 'pointer'}} onClick={() => saveFields(row.id)}/>}
                                {/*<DeleteIcon style={{cursor: 'pointer'}} onClick={() => deleteItem(row.id)}/>*/}
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={requests.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}

const CustomizedTables = (type) => {
    const [value, setValue] = React.useState(null);
    const [requests, setRequests] = React.useState([]);
    const [photo, setPhoto] = useState('')

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    React.useEffect(() => {
        async function fetchMyAPI() {
            const response = await axios.get('http://localhost:9000/requests/'+ type.type, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            setRequests(response.data)
        }

        fetchMyAPI()
    }, [])

    const valueName = useRef('')
    const valueDescription = useRef('')
    const edit = (nameEdit, descriptionEdit) =>{
        valueName.current = nameEdit
        valueDescription.current =descriptionEdit
        setValue(nameEdit)
    }
    let token;
    const saveFields = (id, genreName, reqId) =>{
        const formData = new FormData()
        // @ts-ignore
        formData.append('name', valueName.current.value)
        // @ts-ignore
        formData.append('description', valueDescription.current.value)
        formData.append('image', photo)
        const payload = {
            user: id, text: 'Заявка одобрена'
        }
        if(type === 'genres') payload.text='Ваша заявка на добавления жанра рассмотрена. Жанр "'+genreName+'" добавлен на сайт'
        else payload.text='Ваша заявка на добавления фандома рассмотрена. Фандом "'+genreName+'" добавлен на сайт'
        token = localStorage.getItem('token');
        // @ts-ignore
        if (token && photo && valueName.current.value !== '' && valueDescription.current.value !== '') {
            axios.post('http://localhost:9000/notifications', payload,{
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(resp => {
                    axios.post('http://localhost:9000/'+type.type, formData,{
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    })
                        .then(resp => {
                            axios.delete('http://localhost:9000/requests/'+reqId, {
                                headers: {
                                    Authorization: 'Bearer ' + token
                                }
                            })
                        })
                    })
        }
        setValue(null)
    }
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState('hi');
    const [selectedValue2, setSelectedValue2] = React.useState('hi');

    const handleClickOpen = (userId, reqId) => {
        setSelectedValue(userId);
        setSelectedValue2(reqId);
        setOpen(true);
    };

    const handleClose = (value: string) => {
        setOpen(false);
        const response = axios.get('http://localhost:9000/requests/'+ type.type, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => setRequests(resp.data))
        setSelectedValue(value);
    };
    const onMainPhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length) {
            // @ts-ignore
            setPhoto(e.target.files[0]);
        }
    }
    return (
        <div>
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 700}} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Название</StyledTableCell>
                        <StyledTableCell>Описание</StyledTableCell>
                        <StyledTableCell>Картинка</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <StyledTableRow key={row.name}>
                            <StyledTableCell component="th" scope="row">
                                {value === row.name ? <TextField inputRef={valueName} id="standard-basic" variant="standard" error defaultValue={row.name}/> : row.name}
                            </StyledTableCell>
                            <StyledTableCell>{value === row.name ? <TextField inputRef={valueDescription} id="standard-basic" variant="standard" error defaultValue={row.description}/> :row.description}</StyledTableCell>
                            <StyledTableCell>{value === row.name ?  <div style={{cursor: 'pointer'}} className={style.example2}>
                                <div style={{cursor: 'pointer'}} className={style.formGroup}>
                                    <input style={{cursor: 'pointer'}} onChange={onMainPhotoSelected} type="file" name="file" id="file"
                                           className={style.inputFile}/>
                                    <label style={{width: '100%', cursor: 'pointer'}} htmlFor="file" id="center"
                                           className={classNames(style.input, style.label)}>
                                        <FileUploadIcon fontSize='small'/>
                                    </label>
                                </div>
                            </div> :<div style={{height: '100px', width: '100px', objectFit:'cover', background: '#423642'}} />}</StyledTableCell>
                            <StyledTableCell>
                                {value !== row.name ?<EditIcon style={{cursor: 'pointer'}} onClick={() => edit(row.name, row.description)}/>:<DoneIcon style={{cursor: 'pointer'}} onClick={() => saveFields(row.user.id, row.name, row.id)}/>}
                                <DeleteIcon style={{cursor: 'pointer'}} onClick={() => handleClickOpen(row.user.id, row.id)}/>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
            <SimpleDialog
                selectedValue={selectedValue}
                selectedValue2={selectedValue2}
                open={open}
                onClose={handleClose}
            />
        </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={requests.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
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

const AdministrationPanel = () => {
    const [value, setValue] = React.useState(0);
    const [role, setRole] = useState('');
    React.useEffect(() => {
        async function fetchMyAPI() {
            setRole(localStorage.getItem('role'));
        }

        fetchMyAPI()
    }, [])

    const matches = useMediaQuery(
        json2mq({
            minWidth: 850,
        }),
    );

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <div className={style.section}>
            <div className={style.container1}>
                <Box sx={{width: '100%'}}>
                        <Box sx={{display: 'flex', justifyContent: 'center'}}>
                            <BootstrapTabs style={matches? {margin: '100px 0 0'}: {margin: '0'}}
                                value={value}
                                onChange={handleChange}
                                variant="scrollable"
                                scrollButtons
                                allowScrollButtonsMobile
                                aria-label="scrollable force tabs example"
                            >
                                <Tab label="Заявки Фандомы" />
                                <Tab label="Заявки Жанры" />
                                <Tab label="Жалобы" />
                                <Tab label="Фандомы" />
                                <Tab label="Жанры" />
                                {role==='SUPER_ADMIN'?<Tab label="Пользователи" />:''}
                            </BootstrapTabs>
                    </Box>
                    {value===0?<CustomizedTables type={'fandoms'}/> : ''}
                    {value===1? <CustomizedTables type={'genres'}/> : ''}
                    {value===2? <Complaints/> : ''}
                    {value===3?<Fandoms type='fandoms'/> : ''}
                    {value===4?<Fandoms type='genres'/>: ''}
                    {value===5 && role==='SUPER_ADMIN'?<Admins/> : ''}
                </Box>
            </div>
        </div>
    );
};

export default AdministrationPanel;