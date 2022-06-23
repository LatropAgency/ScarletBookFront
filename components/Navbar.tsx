// @ts-nocheck
import * as React from 'react';
import style from '../styles/navbarPc.module.scss'
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";
import axios from "axios";
import classNames from "classnames";
import {useState} from "react";
import {useRouter} from "next/router";


export const Navbar = () => {
    const [value, setValue] = React.useState(0);
    const [token, setToken] = useState('');
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [img, setImg] = useState('');
    const router = useRouter();
    const [genresD, stGenresD] = useState([])
    const [fandomsD, stFandomsD] = useState([])
    const [query, setQuery] = React.useState('')
    const [timer, setTimer] = React.useState(null)
    const [data, setData] = React.useState([{users:[]},{userfullname:[]}, {stories:[]}])
    const [visibility, setVis] = React.useState({visibility: 'visible'})
    const [role, setRole] = React.useState('');

    React.useEffect(() => {
        async function fetchMyAPI() {

            setToken(localStorage.getItem('token'))
            setId(localStorage.getItem('id'));
            setUsername(localStorage.getItem('username'))
            setImg(localStorage.getItem('img'))
            setRole(localStorage.getItem('role'))
            const response = await axios.get('http://localhost:9000/genres')
            stGenresD(response.data)
            const resp = await axios.get('http://localhost:9000/fandoms')
            stFandomsD(resp.data)
        }

        fetchMyAPI()
    }, [])

    const search = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
        if(e.target.value.length === 0){
            setVis({visibility: 'hidden'})
        }else setVis({visibility: 'visible'})
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
    const findGenre = (idG) =>{
        localStorage.setItem('genre', '');
        router.push('/search')
    }

    const findFandome = (idG) =>{
        localStorage.setItem('fandome', '');
        router.push('/search')
    }
    const logout = () => {
        localStorage.clear();
        location.reload()
    }

    return (
        <div className={style.navContainer}>
            <div className={style.ganreNav}>

                <nav className={style.nav}>
                    <ul className={style["nav-ul"]}>
                        <li style={{cursor: 'pointer'}} className={classNames(style.navli, style.navitems)}>Жанры
                            <ul className={style.ganres}>
                                {genresD.map(map =>{
                                    return (
                                        <li style={{cursor: 'pointer'}} className={style.ganresli} onClick={() => router.push('/genres/'+map.id)}><p>{map.name}</p></li>
                                    )
                                })}
                            </ul>
                        </li>
                    </ul>
                </nav> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
                <nav className={style.nav}>
                    <ul className={style["nav-ul"]}>
                        <li style={{cursor: 'pointer'}} className={classNames(style.navli, style.navitems)}>Фандомы
                            <ul className={style.ganres}>
                                {fandomsD.map(map =>{
                                    return (
                                    <li style={{cursor: 'pointer'}} className={style.ganresli} onClick={() => router.push('/fandoms/'+map.id)}><p>{map.name}</p></li>
                                    )
                                })}
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>

            <a onClick={() => router.push('/')} className={style.logoNav}>
                <div style={{cursor: 'pointer'}} className={style.logo}></div>
            </a>
            <div className={style.profileNav}>
                <div className={style.ganreNav}>
                    <div className={style.ganreNav}>
                        <nav className={style.nav}>
                            <ul className={style["nav-ul"]}>
                                <li onClick={() => router.push('/infolist')} style={{cursor: 'pointer'}} className={classNames(style.navli, style.navitems)}>Инфолист
                                </li>
                            </ul>
                        </nav> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
                        <nav className={style.nav}>
                            <ul className={style["nav-ul"]}>
                                <li onClick={() => router.push('/search')} style={{cursor: 'pointer'}} className={classNames(style.navli, style.navitems)}>Поиск

                                </li>
                            </ul>
                        </nav>
                    </div>
                            <div style={visibility} className={style.displayS}>
                                {data[0].users.map(map =>{
                                    return(
                                        <div style={{cursor: 'pointer'}} onClick={() => router.push('/users/'+map.id)}>{map.name}</div>
                                    )
                                })}
                                {data[1].userfullname.map(map =>{
                                    return(
                                        <div style={{cursor: 'pointer'}} onClick={() => router.push('/users/'+map.id)}>{map.name}</div>
                                    )
                                })}
                                {data[2].stories.map(map =>{
                                    return(
                                        <div style={{cursor: 'pointer'}} onClick={() => router.push('/story/'+map.id)}>{map.name}</div>
                                    )
                                })}
                            </div>
                </div>


                {token ?
                    <nav className={style.nav}>
                        <ul className={style["nav-ul"]}>
                            <li className={classNames(style.navli, style.navitems)}>
                                <div style={{cursor: 'pointer'}} onClick={() => router.push('/users/')} className={style.user}>

                                    <div className={style.photo}><img style={{margin: 0}} className={style.photo} src={'http://localhost:9000/'+img} alt=""/></div>
                                </div>
                                <ul className={style.ganres2}>
                                    <li style={{cursor: 'pointer'}} className={style.ganresli} onClick={() => router.push('/users/editProfile')}><p>Редактировать профиль</p></li>
                                    <li style={{cursor: 'pointer'}} className={style.ganresli} onClick={() => router.push('/messages')}><p>Сообщения</p></li>
                                    {role === 'ADMIN' || role === 'SUPER_ADMIN'?<li style={{cursor: 'pointer'}} className={style.ganresli} onClick={() => router.push('/administration')}><p>Панель администратора</p></li> : ''}
                                    <li style={{cursor: 'pointer'}} className={style.ganresli} onClick={logout}><p>Выход</p></li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                    : <div className={style.user}>
                    <div className={style.username}>
                        <button className={style.login}><RegistrationForm/></button>
                        /
                        <button className={style.reg}><LoginForm/></button>
                    </div>

                </div>}

            </div>

        </div>
    );
}