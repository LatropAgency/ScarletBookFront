// @ts-nocheck
import React from 'react';
import style from "./../../styles/RegistrationForm.module.scss";
import {useInput} from "./../../hooks/useInput";
import axios from "axios";
import {useRouter} from 'next/router';
import MainLayout from "./../../layouts/MainLayout";
import useMediaQuery from "@mui/material/useMediaQuery";
import json2mq from 'json2mq';

import GoogleLogin from 'react-google-login';
import {Link} from "@mui/material";

const Index = () => {
    const email = useInput('')
    const password = useInput('')
    const [value, setValue] = React.useState(null)
    const error = (e) => {
        setValue(e)
    }
    const router = useRouter();
    const registration = () => {
        const formData = new FormData()
        const payload = {
            "email": email.value,
            "password": password.value
        }
        formData.append('email', email.value)
        formData.append('password', password.value)
        axios.post('http://localhost:9000/auth/login', payload)
            .then(resp => {
                localStorage.setItem('token', resp.data.token);
                localStorage.setItem('id', resp.data.user.id);
                localStorage.setItem('username', resp.data.user.username)
                localStorage.setItem('role', resp.data.user.roles)
                localStorage.setItem('img', resp.data.user.img)
                router.push('/');
                console.log(localStorage.getItem('token'))
                location.reload()
            })
            .catch(e => error(e.response.data.message))
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
            })
            .catch(e => error(e.response.data.message))
    }

    return (
        <MainLayout>
        <div style={matches? {margin: '100px 0 0'}: {margin: '0'}} className={style.modalDialogAuth2}>
            <div className={style.modalDialogBody2}>
                <div style={{display: 'flex', justifyContent:'center', flexDirection:'column', alignItems: 'center', fontFamily: 'Calibri Light'}} className={style.authForm}>
                    <h2>Авторизация</h2>
                    <form style={{display: 'flex', justifyContent:'center', flexDirection:'column', alignItems: 'center'}} id="auth">
                        <span className={style.errorAuth}>{value}</span>
                        <div>
                            <div>Email:</div>
                            <input {...email} id="loginAuth" className={style.input} type="text" maxLength={25}
                                   autoFocus/>
                        </div>
                        <div>
                            <div>Пароль:</div>
                            <input {...password} id="passwordAuth" className={style.input} name="password" type="password"
                                   maxLength={25}/>
                        </div>
                        <input style={{cursor: 'pointer',margin: '10px 0 5px 0px',}} onClick={registration} type="submit" name="submit" className={style.btnSubmit} value="Вход"></input>
                        {/*<input style={{margin: '10px 0 5px 0px', padding: '5px 20px', width: 'auto', cursor: 'pointer'}} onClick={registrationGoogle} className={style.btnSubmit} type="submit" name="submit"*/}
                        {/*       value="Google авторизация"/>*/}
                        {/*<a href="http://localhost:9000/google/redirect" >gthtqlb</a>*/}
                        {/*<input style={{margin: '10px auto 30px auto', padding: '5px 20px', width: 'auto', cursor: 'pointer'}} onClick={() => router.push('/registration')} className={style.btnSubmit} type="submit" name="submit"*/}
                        {/*       value="Регистриция"/>*/}
                    </form>
                </div>
            </div>
        </div>
        </MainLayout>
    );
};

export default Index;