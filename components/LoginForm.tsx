// @ts-nocheck
import React, {useState} from 'react';
import style from './../styles/LoginForm.module.scss'
import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import {MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import classNames from 'classnames';
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker';
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import axios from "axios";
import {useRouter} from "next/router";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const BootstrapTextField = styled(TextField)(({theme}) => ({
    '& .MuiOutlinedInput-input': {
        padding: '5px 10px',
        margin: 0,
        fontSize: '13pt'
    },
}));

const BootstrapDataTime = styled(DesktopDatePicker)(({theme}) => ({
    '& .MuiButtonBase-root .MuiPickersDay-root .Mui-selected .MuiPickersDay-dayWithMargin .css-bkrceb-MuiButtonBase-root-MuiPickersDay-root': {
        background: 'red',
        color: 'blue',
        padding: 0,
        margin: 0,
        border: 'red'
    },
}));

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const {children, onClose, ...other} = props;

    return (
        <DialogTitle sx={{m: 0, p: 2}} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

const LoginForm = () => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };


    const [photo, setPhoto] = useState(null)
    const [photo2, setPhoto2] = useState(null)
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')

    const [errorPass, setErrorPass] = useState(null)
    const [errorEmail, setErrorEmail] = useState(null)
    const [errorUsername, setErrorUsername] = useState(null)
    const [errorName, setErrorName] = useState(null)
    const [errorLastname, setErrorLastname] = useState(null)

    const validUsername = (value) =>{
        if(value.length < 2){
            setErrorUsername('Длина не менее 2 сиволов')
        } else{setErrorUsername('')}
        setUsername(value)
    }

    const validName = (value) =>{
        if(value.length < 2){
            setErrorName('Длина не менее 2 сиволов')
        } else{setErrorName('')}
        setName(value)
    }

    const validLastname = (value) =>{
        if(value.length < 2){
            setErrorLastname('Длина не менее 2 сиволов')
        } else{setErrorLastname('')}
        setLastname(value)
    }

    const validatePass = (value) => {
        if(value.length < 6){
            setErrorPass('Длина пароля должна превышать 6 символов')
        } else {setErrorPass('')}
        setPassword(value)
    }
    const validatePass2 = (value) => {
        if(value !== password){
            setErrorPass('Пароли не совпадают')
        } else {setErrorPass('')}
        setPassword2(value)
    }

    const validateEmail = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    const validEmail = async (value) => {
        if(!validateEmail(value)){
            setErrorEmail('Некорректный Email')
        } else {
            const resp = await axios.post('http://localhost:9000/users/find-users/by-email', {email:value})
            if(resp.data){
                setErrorEmail('Email занят')
            }else {setErrorEmail('')}
        }
        setEmail(value)
    }
    const [orientation, setOrientation] = React.useState('Женский');
    const handleChangeOrientation = (event: SelectChangeEvent) => {
        setOrientation(event.target.value as string);
    };
    const onMainPhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length) {
            setPhoto(e.target.files[0]);
            setPhoto2(URL.createObjectURL(e.target.files[0]));
        }
    }
    const [date, setDate] = React.useState<Date | null>(
        new Date(),
    );
    const router = useRouter();
    const registration = (event) => {
        if(errorPass === '' && errorEmail === '' && errorUsername === '' && errorName === '' && errorLastname === '') {
            const formData = new FormData()
            formData.append('email', email)
            formData.append('password', password)
            formData.append('username', username)
            formData.append('name', name)
            formData.append('lastname', lastname)
            formData.append('provider', 'default')
            formData.append('role', 'USER')
            formData.append('birthday', date.toString())
            formData.append('sex', orientation)
            formData.append('image', photo)
            axios.post('http://localhost:9000/auth/registration', formData)
                .then(resp => {
                    localStorage.setItem('token', resp.data.token);
                    localStorage.setItem('id', resp.data.user.id);
                    localStorage.setItem('username', resp.data.user.username)
                    localStorage.setItem('role', resp.data.user.roles)
                    localStorage.setItem('img', resp.data.user.img)
                    router.push('/');
                })
                .catch(e => error(e.message))
        } else{ event.preventDefault();}
    }
    const registrationGoogle = (event) => {
        event.preventDefault();
        axios.get('http://localhost:9000/google/redirect')
            .then(resp => {
                localStorage.setItem('token', resp.data.token);
                localStorage.setItem('id', resp.data.user.id);
                localStorage.setItem('username', resp.data.user.username)
                localStorage.setItem('role', resp.data.user.roles)
                localStorage.setItem('img', resp.data.user.img)
                router.push('/');
            })
            .catch(e => error(e.message))
    }

    return (
        <div>
            <div style={{cursor: "pointer"}} onClick={handleClickOpen}>
                Регистрация
            </div>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >

                <div style={{height: 'auto'}} className={style.modalDialogReg}>
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}/>
                    <div style={{height: 'auto'}} className={style.modalDialogBody}>
                        <form style={{fontFamily: 'Calibri Light', fontSize: '13pt'}} id="validation" className="form">
                            <h2>Регистрация</h2>
                            <div style={{margin: '3px 0'}}>Имя пользователя</div>
                            <input style={{fontSize: '13pt'}} value={username} onChange={(e) => validUsername(e.target.value)} id="login" className={style.input} type="text" name="login" maxLength={25}
                                   autoFocus/>
                            <br/><span className="errorLogin">{errorUsername}</span>
                            <div style={{margin: '3px 0'}}>Имя</div>
                            <input style={{fontSize: '13pt'}} value={name} onChange={(e) => validName(e.target.value)} id="login" className={style.input} type="text" name="login" maxLength={25}
                                   autoFocus/>
                            <br/><span className="errorLogin">{errorName}</span>
                            <div style={{margin: '3px 0'}}>Фамилия</div>

                            <input style={{fontSize: '13pt'}} value={lastname} onChange={(e) => validLastname(e.target.value)} id="login" className={style.input} type="text" name="login" maxLength={25}
                                   autoFocus/>
                            <br/><span>{errorLastname}</span>
                            <div style={{margin: '3px 0'}}>Пароль:</div>
                            <input style={{fontSize: '13pt'}} value={password} onChange={(e) => validatePass(e.target.value)} id="password" className={style.input} name="password" type="password"
                                   maxLength={25}/>
                            <span className="errorPass"></span>

                            <div style={{margin: '3px 0'}}>Повторите пароль:</div>
                            <input style={{fontSize: '13pt'}} value={password2} onChange={(e) => validatePass2(e.target.value)} id="password2" className={style.input} name="password2" type="password"/>
                            <br/><span style={{fontSize: '10pt'}} className="errorPass2">{errorPass}</span>
                            <div style={{margin: '3px 0'}}>E-mail:</div>
                            <input style={{fontSize: '13pt'}} value={email} onChange={(e) => validEmail(e.target.value)} id="email" className={style.input} name="email" type="text"/>
                            <br/><span className="error">{errorEmail}</span>
                            <div style={{margin: '3px 0'}}>День Рождения:</div>
                            <span className="error"></span>
                            <div className={style.selectGroup}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <BootstrapDataTime
                                        sx={{fontSize: '13pt'}}
                                        maxDate={new Date()}
                                        inputFormat="dd/MM/yyyy"
                                        value={date}
                                        onChange={(newValue) => setDate(newValue)}
                                        renderInput={(params) => <BootstrapTextField
                                            style={{margin: 0, padding: 0, border: 'none'}}
                                            className={style.input} {...params} />}/>
                                </LocalizationProvider>
                            </div>
                            <span className="errorDate"></span>
                            <div style={{margin: '3px 0'}}>Пол:</div>
                            <Select style={{fontSize: '13pt'}}
                                value={orientation}
                                label="orientation"
                                onChange={handleChangeOrientation}
                                className={style.input}
                            >
                                <MenuItem style={{fontSize: '13pt'}} value='Женский'>Женский</MenuItem>
                                <MenuItem style={{fontSize: '13pt'}} value='Мужский'>Мужский</MenuItem>
                            </Select>

                            <div>Аватар</div>
                            <div className={style.avatarSelect}>
                                <div className={style.avatar}><img src={photo2}/></div>
                                <div style={{cursor: 'pointer'}} className={style.example2}>
                                    <div style={{cursor: 'pointer'}} className={style.formGroup}>
                                        <input style={{cursor: 'pointer'}} onChange={onMainPhotoSelected} type="file" name="file" id="file"
                                               className={style.inputFile}/>
                                        <label  style={{width: '100%', cursor: 'pointer'}} htmlFor="file" id="center"
                                               className={classNames(style.input, style.label)}>
                                            <FileUploadIcon fontSize='small'/>
                                            <div style={{fontSize: '13pt'}}>Загрузить файл</div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <input style={{margin: '0px 0 30px 0px'}} onClick={registration} className={style.submit} type="submit" name="submit"
                                   value="Зарегистрироваться"/>
                            <br/>
                            {/*<input style={{margin: '10px 0 30px 0px'}} onClick={registrationGoogle} className={style.submit} type="submit" name="submit"*/}
                            {/*       value="Google регистрация"/>*/}

                        </form>
                    </div>
                </div>
            </BootstrapDialog>
        </div>
    );
}

export default LoginForm;