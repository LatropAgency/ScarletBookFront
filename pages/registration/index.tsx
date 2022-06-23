// @ts-nocheck
import React, {useState} from 'react';
import style from '../../styles/LoginForm.module.scss'
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import classNames from "classnames";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {styled} from "@mui/material/styles";
import {DesktopDatePicker} from "@mui/x-date-pickers/DesktopDatePicker";
import {MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import {useInput} from "../../hooks/useInput";
import axios from "axios";
import {useRouter} from "next/router";
import {ru} from 'date-fns/locale';
import MainLayout from "../../layouts/MainLayout";
import useMediaQuery from "@mui/material/useMediaQuery";
import json2mq from 'json2mq';

const BootstrapDataTime = styled(DesktopDatePicker)(({theme}) => ({
    '& .MuiButtonBase-root .MuiPickersDay-root .Mui-selected .MuiPickersDay-dayWithMargin .css-bkrceb-MuiButtonBase-root-MuiPickersDay-root': {
        background: 'red',
        color: 'blue',
        padding: 0,
        margin: 0,
        border: 'red'
    },
}));

const BootstrapTextField = styled(TextField)(({theme}) => ({
    '& .MuiOutlinedInput-input': {
        padding: '5px 10px',
        margin: 0,
    },
}));

const Index = () => {
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
                .catch(e => error(e.response.data.message))
        } else{ event.preventDefault();}
    }
    const matches = useMediaQuery(
        json2mq({
            minWidth: 850,
        }),
    );
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
            }, {
                headers:{
                    "Access-Control-Allow-Origin": 'http://localhost:9000'
                }
            })
            .catch(e => error(e.message))
    }

    return (
        <MainLayout>
            <div style={{fontFamily: 'Calibri Light'}}  className={style.modalDialogReg2}>
                <div style={matches? {margin: '100px 0 0'}: {margin: '0'}} className={style.modalDialogBody2}>
                    <form style={{fontFamily: 'Calibri Light'}} id="validation" className="form">
                        <h2>Регистрация</h2>
                        <div style={{margin: '5px 0'}}>Имя пользователя</div>
                        <input value={username} onChange={(e) => validUsername(e.target.value)} id="login" className={style.input} type="text" name="login" maxLength={25}
                               autoFocus/>
                        <br/><span className="errorLogin">{errorUsername}</span>
                        <div style={{margin: '5px 0'}}>Имя</div>
                        <input value={name} onChange={(e) => validName(e.target.value)} id="login" className={style.input} type="text" name="login" maxLength={25}
                               autoFocus/>
                        <br/><span className="errorLogin">{errorName}</span>
                        <div style={{margin: '5px 0'}}>Фамилия</div>

                        <input value={lastname} onChange={(e) => validLastname(e.target.value)} id="login" className={style.input} type="text" name="login" maxLength={25}
                               autoFocus/>
                        <br/><span>{errorLastname}</span>
                        <div style={{margin: '5px 0'}}>Пароль:</div>
                        <input value={password} onChange={(e) => validatePass(e.target.value)} id="password" className={style.input} name="password" type="password"
                               maxLength={25}/>
                        <span className="errorPass"></span>

                        <div style={{margin: '5px 0'}}>Повторите пароль:</div>
                        <input value={password2} onChange={(e) => validatePass2(e.target.value)} id="password2" className={style.input} name="password2" type="password"/>
                        <br/><span style={{fontSize: '10pt'}} className="errorPass2">{errorPass}</span>
                        <div style={{margin: '5px 0'}}>E-mail:</div>
                        <input value={email} onChange={(e) => validEmail(e.target.value)} id="email" className={style.input} name="email" type="text"/>
                        <br/><span className="error">{errorEmail}</span>
                        <div style={{margin: '5px 0'}}>День Рождения:</div>
                        <span className="error"></span>
                        <div className={style.selectGroup}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}
                                                  locale={ru}>
                                <BootstrapDataTime
                                    maxDate={new Date()}
                                    inputFormat="dd/MM/yyyy"
                                    value={date}
                                    onChange={(newValue) => setDate(newValue)}
                                    renderInput={(params) => <BootstrapTextField
                                        style={{margin: 0, padding: 0, border: 'none'}}
                                        className={style.input} {...params} />}
                                />
                            </LocalizationProvider>
                        </div>
                        <span className="errorDate"></span>

                            <div style={{margin: '5px 0'}}>Пол:</div>
                            <Select
                                value={orientation}
                                label="orientation"
                                onChange={handleChangeOrientation}
                                className={style.input}
                            >
                                <MenuItem value='Женский'>Женский</MenuItem>
                                <MenuItem value='Мужский'>Мужский</MenuItem>
                            </Select>


                        <div style={{margin: '5px 0'}}>Аватар</div>
                        <div className={style.avatarSelect}>
                            <div className={style.avatar}><img src={photo2}/></div>
                            <div style={{cursor: 'pointer'}} className={style.example2}>
                                <div style={{cursor: 'pointer'}} className={style.formGroup}>
                                    <input style={{cursor: 'pointer'}} onChange={onMainPhotoSelected} type="file" name="file" id="file"
                                           className={style.inputFile}/>
                                    <label style={{width: '100%', cursor: 'pointer'}} htmlFor="file" id="center"
                                           className={classNames(style.input, style.label)}>
                                        <FileUploadIcon fontSize='small'/>
                                        <div style={{fontSize: '10pt'}}>Загрузить файл</div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <input onClick={registration} className={style.submit} type="submit" name="submit"
                               value="Зарегистрироваться"/>
                        <br/><br/>
                        <input style={{margin: '0 0 30px 0px'}} onClick={registrationGoogle} className={style.submit} type="submit" name="submit"
                               value="Google регистрация"/>

                    </form>
                </div>
            </div>
        </MainLayout>
    );
};

export default Index;