// @ts-nocheck
import React, {useState} from 'react';
import {styled} from "@mui/material/styles";
import {Autocomplete, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import style from "../../styles/CreateStory.module.scss";
import classNames from "classnames";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import MainLayout from '../../layouts/MainLayout';
import axios from "axios";
import {useInput} from "../../hooks/useInput";
import {useRouter} from "next/router";

const BootstrapTextField = styled(TextField)(({theme}) => ({
    '& .MuiOutlinedInput-root': {
        padding: theme.spacing(2),
    },
    '& .MuiInputBase-root': {
        padding: theme.spacing(1),
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

const Create = () => {
    const [genresD, stGenresD] = useState([])
    const [fandomsD, stFandomsD] = useState([])
    const name = useInput('')
    const description = useInput('')
    const partners = useInput('')
    React.useEffect(() => {
        async function fetchMyAPI() {
            const response = await axios.get('http://localhost:9000/genres')
            stGenresD(response.data)
            const resp = await axios.get('http://localhost:9000/fandoms')
            stFandomsD(resp.data)
        }

        fetchMyAPI()
    }, [])
    const [photo, setPhoto] = useState(null)
    const [photo2, setPhoto2] = useState(null)

    const onMainPhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length) {
            setPhoto(URL.createObjectURL(e.target.files[0]));
            setPhoto2(e.target.files[0]);
        }
    }
    const [age, setAge] = React.useState('');
    const [orientation, setOrientation] = React.useState('');
    const [genres, setGenres] = React.useState(null);
    const [fandoms, setFandoms] = React.useState(null);

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };
    const handleChangeOrientation = (event: SelectChangeEvent) => {
        setOrientation(event.target.value as string);
    };

    const router = useRouter();
    const create = () => {
        const formData = new FormData()
        formData.append('name', name.value)
        formData.append('description', description.value)
        formData.append('orientation', orientation)
        formData.append('age', age)
        formData.append('user', localStorage.getItem('id'))
        formData.append('fandom', fandoms)
        formData.append('status', 'В процессе')
        formData.append('partners', partners.value)
        formData.append('genres', JSON.stringify(genres))
        formData.append('image', photo2)
        axios.post('http://localhost:9000/stories', formData, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(resp => {
                router.push('/users');
            })
            .catch(e => error(e.message))
    }

    return (
        <MainLayout>
            <div className={style.modalDialogReg2}>
                <div className={style.modalDialogBody2}>
                    <div className={style.imgBlock}>
                        <div className={style.avatarSelect}>
                            <div className={style.avatar}><img width='100%' height='100%' src={photo}/></div>
                            <div className={style.example2}>
                                <div className={style.formGroup}>
                                    <input onChange={onMainPhotoSelected} type="file" name="file" id="file" className={style.inputFile}/>
                                    <label style={{width: '100%'}} htmlFor="file" id="center"
                                           className={classNames(style.input2, style.label)}>
                                        <FileUploadIcon fontSize='small'/>
                                        <div style={{fontSize: '10pt'}}>Загрузить файл</div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="validation" className="form">
                        <h2>Создать историю</h2>
                        <div>Название</div>
                        <input {...name} id="login" className={style.input2} type="text" name="login" maxLength={25}
                               autoFocus/>
                        <span className="errorLogin"></span>

                        <div>Описание</div>
                        <BootstrapTextField {...description} style={{height: '150px'}} className={style.input2} multiline
                                            rows={6}/>
                        <span className="errorPass"></span>

                        <div>Главные герои</div>
                        <input {...partners} className={style.input2} type="text"/>
                        <span className="errorPass2"></span>
                        <div>Жанры</div>
                        <BootstrapAutocomplete
                            multiple
                            style={{height: 'auto'}}
                            options={genresD}
                            className={style.input2}
                            getOptionLabel={(option) => option.name}
                            filterSelectedOptions
                            onChange={(event, value) => setGenres(value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Жанр"
                                />
                            )}
                        />
                        <div>Фандом</div>
                        <BootstrapAutocomplete
                            style={{height: 'auto'}}
                            options={fandomsD}
                            className={style.input2}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, value) => setFandoms(value.id)}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Фандом"
                                />
                            )}
                        />
                        <div className={style.age2}>
                            <div>
                                <div>Возраст</div>
                                <Select
                                    value={age}
                                    label="Age"
                                    onChange={handleChange}
                                    className={style.input2}
                                >
                                    <MenuItem value='14+'>14+</MenuItem>
                                    <MenuItem value='16+'>16+</MenuItem>
                                    <MenuItem value='18+'>18+</MenuItem>
                                </Select>
                            </div>
                            <div>
                                <div>Направленность</div>
                                <Select
                                    value={orientation}
                                    label="orientation"
                                    onChange={handleChangeOrientation}
                                    className={style.input2}
                                >
                                    <MenuItem value='slesh'>Слеш</MenuItem>
                                    <MenuItem value='femslesh'>Фемслеш</MenuItem>
                                    <MenuItem value='get'>Гет</MenuItem>
                                </Select>
                            </div>
                        </div>
                        <span className="error"></span>
                        <br/>
                        <input onClick={create} style={{margin: '0 40%'}} className={style.submit} type="submit" name="submit"
                               value="Создать"/>

                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Create;
