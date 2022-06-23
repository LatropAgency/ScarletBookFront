// @ts-nocheck
import React, { useState } from "react";
import s from '../styles/EditProfile.module.scss';
import classNames from "classnames";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {alpha, Autocomplete, styled, Switch, TextField} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import json2mq from 'json2mq';
import axios from "axios";
import {useInput} from "../hooks/useInput";

const RedSwitch = styled(Switch)(({theme}) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: '#A01010',
        '&:hover': {
            backgroundColor: alpha('#A01010', theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: '#A01010',
    },
}));

const BootstrapAutocomplete = styled(Autocomplete)(({theme}) => ({
    '& .MuiOutlinedInput-root': {
        padding: theme.spacing(0),
    },
    '& .MuiInputBase-root': {
        padding: theme.spacing(0),
    },
}));


const EditProfile = ({user}) => {
    const [userInfo, setUserInfo] = useState(user)
    // const email = useInput(userInfo?userInfo.email: '')
    // const username = useInput(userInfo?userInfo.username:'')
    // const name = useInput(userInfo?userInfo.name: '')
    // const lastname = useInput(userInfo?userInfo.lastname:'')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')
    const [emailError, setEmailError] = useState('')

    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [password3, setPassword3] = useState('')
    const [errorPass, setErrorPass] = useState(null)
    const [errorPassServer, setErrorPassServer] = useState('')
    const [access, setAccess] = useState('')
    const [error, setError] = useState('')
    const matches = useMediaQuery(
        json2mq({
            minWidth: 850,
        }),
    );
    const [photo, setPhoto] = useState('../static/images/backgroundRed.svg')
    const [photo2, setPhoto2] = useState(null)

    const onMainPhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length) {
            setPhoto(URL.createObjectURL(e.target.files[0]));
            console.log(photo)
            setPhoto2(e.target.files[0])
        }
    }
    let token ='';
    if (typeof window !== 'undefined') {
        // Perform localStorage action
        token = localStorage.getItem('token');
    }
    const [checked, setChecked] = React.useState(true);
    const [checked1, setChecked1] = React.useState(true);
    const [checked2, setChecked2] = React.useState(true);

    React.useEffect( () => {
         function fetchMyAPI() {
            setChecked(user.notification_statistic);
             setChecked1(user.notification_message);
             setChecked2(user.notification_comments);
             setPhoto('http://localhost:9000/'+user.image)
             setUserInfo(user)
             setName(user.name)
             setEmail(user.email)
             setUsername(user.username)
             setLastname(user.lastname)
        }
         fetchMyAPI()
    }, [user])


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        axios.patch('http://localhost:9000/users', {notification_statistic: event.target.checked}, {
            headers: {
                Authorization: 'Bearer ' + token
            }})
            .then(resp => {

            })
            .catch(e => console.log(e.message))
        setChecked(event.target.checked);
    };

    const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        axios.patch('http://localhost:9000/users', {notification_message: event.target.checked}, {
            headers: {
                Authorization: 'Bearer ' + token
            }})
            .then(resp => {

            })
            .catch(e => console.log(e.message))
        setChecked1(event.target.checked);
    };

    const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        axios.patch('http://localhost:9000/users', {notification_comments: event.target.checked}, {
            headers: {
                Authorization: 'Bearer ' + token
            }})
            .then(resp => {

            })
            .catch(e => console.log(e.message))
        setChecked2(event.target.checked);
    };

    const saveImage = () => {
        const formData = new FormData()
        formData.append('image', photo2)
        axios.patch('http://localhost:9000/users/update/image', formData, {
            headers: {
                Authorization: 'Bearer ' + token
            }})
            .then(resp => {
                localStorage.setItem('img', resp.data.image)
            })
            .catch(e => console.log(e.message))
    }
    const validateEmail = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    const saveChanges = async (event) => {
        const payload ={
            email: email,
            username: username,
            name: name,
            lastname: lastname
        }
        console.log(payload)
        if(!validateEmail(email)){
            setEmailError('Некорректный Email')
        } else {
            const resp = await axios.post('http://localhost:9000/users/find-users/by-email', {email:email})
            if(resp.data){
                setEmailError('Email занят')
            }else {setEmailError('')}
        }
        if(email !== '' && username !== '' && name !== '' && lastname !== '' && emailError === ''){
            axios.patch('http://localhost:9000/users', payload, {
                headers: {
                    Authorization: 'Bearer ' + token
                }})
                .then(resp => {
                    localStorage.setItem('username', resp.data.username)
                })
                .catch(e => console.log(e.message))
        } else {event.preventDefault(); setError('Данные введены некорректно')}

    }
    const validatePass = (value) => {
        if(value.length < 6){
            setErrorPass('Длина пароля должна превышать 6 символов')
        } else {setErrorPass('')}
        setPassword2(value)
    }
    const validatePass2 = (value) => {
        if(value !== password2){
            setErrorPass('Пароли не совпадают')
        } else {setErrorPass('')}
        setPassword3(value)
    }

    const changePass = () => {
        if(errorPass === '' && password !== ''){
            axios.patch('http://localhost:9000/users/update/password', {password: password}, {
                headers: {
                    Authorization: 'Bearer ' + token
                }})
                .then(resp => {
                    setErrorPassServer('')
                    setPassword('')
                    setPassword2('')
                    setPassword3('')
                    setAccess('Пароль успешно изменён')
                })
                .catch(e => setErrorPassServer(e.response.data.message))
        }else {setErrorPassServer('Данные введены некорректно')}

    }

    return (
        <form style={matches? {margin: '190px 0 0'}: {margin: '0'}} className={s.editInfoBlock}>
            <h3 className={s.h3}>Редактировать профиль</h3>
            <div className={s.container1}>
                <div className={s.photoName}>
                    {/*{isOwner &&*/}
                    <div className={s.upload2}>
                        <div className={s.upload}>
                            <div>
                                <p className={s.p}>Изменить фото</p>
                                <div className={s.example2}>
                                    <div className={s.formGroup}>
                                        <input onChange={onMainPhotoSelected} type="file" name="file" id="file" className={s.inputFile}/>
                                        <label style={{width: '100%'}} htmlFor="file" id="center"
                                               className={classNames(s.input, s.label)}>
                                            <FileUploadIcon fontSize='small'/>
                                            <div style={{fontSize: '10pt', cursor: 'pointer'}}>Загрузить файл</div>
                                        </label>
                                    </div>
                                    <input onClick={saveImage} className={s.submit} type="submit" name="submit"
                                           value="Сохранить"/>
                                </div>
                            </div>
                            <div className={s.photos}>
                                <img src={photo} className={s.photos} alt={""}/>
                            </div>
                        </div>
                        <div>
                            <h3 className={s.h3} style={{margin: '0'}}>Настройка оповещений</h3>
                            <div className={s.upload}>
                                <div>
                                    <p className={s.p}>Статистика</p>
                                    <RedSwitch checked={checked} onChange={handleChange}/>
                                </div>
                                <div>
                                    <p className={s.p}>Сообщения</p>
                                    <RedSwitch checked={checked1} onChange={handleChange1}/>
                                </div>
                                <div>
                                    <p className={s.p}>Упоминания</p>
                                    <RedSwitch checked={checked2} onChange={handleChange2}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*}*/}

                    <div className={s.upload2}>
                        <h3 className={s.h3}>Смена пароля</h3>
                        <div>{errorPassServer}</div>
                        <div>{access}</div>
                        <div className={s.name}>
                            <p className={s.p}>Старый пароль</p>
                            <input type='password' value={password} className={s.input} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div className={s.name}>
                            <p className={s.p}>Новый пароль</p>
                            <div>{errorPass}</div>
                            <input type='password' value={password2} onChange={(e) => validatePass(e.target.value)} className={s.input}/>
                        </div>
                        <div className={s.name}>
                            <p className={s.p}>Повторить пароль</p>
                            <input type='password' value={password3} onChange={(e) => validatePass2(e.target.value)} className={s.input}/>
                        </div>
                        <input onClick={changePass} className={s.submit} type="button" name="submit"
                               value="Сменить пароль"/>
                    </div>
                    <div className={s.upload2}>
                        <h3 className={s.h3}>Редактировать личную информацию</h3>
                        <div>{error}</div>
                        <div className={s.name}>
                            <p className={s.p}>Имя</p>
                            <input className={s.input} value={name} onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className={s.name}>
                            <p className={s.p}>Фамилия</p>
                            <input className={s.input} value={lastname} onChange={(e) => setLastname(e.target.value)}/>
                        </div>
                        <div className={s.name}>
                            <p className={s.p}>Имя пользователя</p>
                            <input className={s.input} value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className={s.name}>
                            <p className={s.p}>E-mail</p>
                            <div>{emailError}</div>
                            <input className={s.input} value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <input onClick={saveChanges} className={s.submit} type="button" name="submit"
                               value="Сохранить"/>
                    </div>
                    {/*<div className={s.upload2} style={{justifyContent: 'flex-start'}}>*/}
                    {/*    <h3 className={s.h3}>Закрытые сообщения</h3>*/}
                    {/*    <div className={s.name}>*/}
                    {/*        <RedSwitch/>*/}
                    {/*    </div>*/}
                    {/*    <BootstrapAutocomplete*/}
                    {/*        multiple*/}
                    {/*        style={{height: 'auto'}}*/}
                    {/*        options={top100Films}*/}
                    {/*        className={s.input}*/}
                    {/*        getOptionLabel={(option) => option.title}*/}
                    {/*        filterSelectedOptions*/}
                    {/*        renderInput={(params) => (*/}
                    {/*            <TextField*/}
                    {/*                {...params}*/}
                    {/*                placeholder="Пользователи"*/}
                    {/*            />*/}
                    {/*        )}*/}
                    {/*    />*/}
                    {/*    <input className={s.submit} type="submit" name="submit"*/}
                    {/*           value="Сохранить"/>*/}
                    {/*</div>*/}
                </div>
            </div>
        </form>
    )
}


export default EditProfile;

const top100Films = [
    {title: 'The Shawshank Redemption', year: 1994},
    {title: 'The Godfather', year: 1972},
    {title: 'The Godfather: Part II', year: 1974},
    {title: 'The Dark Knight', year: 2008},
    {title: 'The Shawshank Redemption', year: 1994},
    {title: 'The Godfather', year: 1972},
    {title: 'The Godfather: Part II', year: 1974},
    {title: 'The Dark Knight', year: 2008}
    ]