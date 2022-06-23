// @ts-nocheck
import React from 'react';
import style from '../styles/RegistrationForm.module.scss'
import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import {useInput} from "../hooks/useInput";
import {useRouter} from "next/router";
import axios from "axios";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
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

const RegistrationForm = () => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

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

    return (
        <div>
            <div style={{cursor:"pointer"}} onClick={handleClickOpen}>
                Вход
            </div>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >

                <div className={style.modalDialogAuth}>
                    <BootstrapDialogTitle id="customized-dialog-title"  onClose={handleClose}/>
                    <div className={style.modalDialogBody}>
                        <div style={{fontSize: '13pt', fontFamily: 'Calibri Light', display: "flex", flexDirection:'column', justifyContent:'center', alignItems:'center'}} className={style.authForm}>
                            <h2>Авторизация</h2>
                            <form style={{fontFamily: 'Calibri Light', display: "flex", flexDirection:'column', justifyContent:'center', alignItems:'center'}} id="auth">
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
                                <div style={{ margin: '20px 0 0 0', cursor: 'pointer'}}  onClick={registration} className={style.btnSubmit}>Вход</div>
                                <br/>
                                {/*<input style={{ width: 'auto'}} onClick={registration} className={style.btnSubmit} type="submit" name="submit"*/}
                                {/*       value="Зарегистрироваться"/>*/}
                                {/*<input style={{margin: '5px 0 10px 0px', width: 'auto'}}  className={style.btnSubmit} type="submit" name="submit"*/}
                                {/*       value="Google регистрация"/>*/}
                            </form>
                        </div>
                    </div>
                </div>
            </BootstrapDialog>
        </div>
    );
}

export default RegistrationForm;