// @ts-nocheck
import React, {useState} from 'react';
import style from "./../styles/CreateStory.module.scss";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import classNames from "classnames";
import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {DialogTitleProps} from "./LoginForm";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {Autocomplete, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import {useInput} from "./../hooks/useInput";
import axios from "axios";
import {useRouter} from "next/router";

const BootstrapTextField = styled(TextField)(({theme}) => ({
    '& .MuiOutlinedInput-root': {
        padding: theme.spacing(2),
        fontSize: '13pt'
    },
    '& .MuiInputBase-root': {
        padding: theme.spacing(1),
        fontSize: '13pt'
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

const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const {children, onClose, ...other} = props;

    return (
        <DialogTitle sx={{m: 'auto', p: 2}} {...other}>
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

const CreateStory = () => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

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
    const [error, setError] = useState('')

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
        if(name.value.length === 0 || description.value.length === 0 || orientation.length === 0 || age.length === 0 || fandoms.length === 0 || partners.value.length === 0 || genres.length === 0 || photo2.length === 0){
            setError('Все поля должны быть заполнены')
        }else {
            axios.post('http://localhost:9000/stories', formData, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
                .then(resp => {
                    router.push('/users');
                    setOpen(false);
                    location.reload()
                })
                .catch(e => error(e.message))
        }
    }

    return (
        <div>
            <div className={style.submit} style={{cursor: "pointer"}} onClick={handleClickOpen}>
                Создать историю
            </div>
            <Dialog
                onClose={handleClose}
                fullWidth={true}
                maxWidth='md'
                open={open}
            >

                <div className={style.modalDialogReg}>
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}/>
                    <div className={style.modalDialogBody}>
                        <div className={style.imgBlock}>
                            <div className={style.avatarSelect}>
                                <div className={style.avatar}><img  width='100%' height='100%' src={photo}/></div>
                                <div style={{cursor: 'pointer'}} className={style.example2}>
                                    <div style={{cursor: 'pointer'}} className={style.formGroup}>
                                        <input style={{cursor: 'pointer'}} onChange={onMainPhotoSelected} type="file" name="file" id="file" className={style.inputFile}/>
                                        <label style={{width: '100%'}} htmlFor="file" id="center"
                                               className={classNames(style.input, style.label)}>
                                            <FileUploadIcon style={{cursor: 'pointer'}} fontSize='small'/>
                                            <div style={{cursor: 'pointer',fontSize: '10pt'}}>Загрузить файл</div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="validation" className="form">
                            <h2>Создать историю</h2>
                            <div>{error}</div>
                            <div>Название</div>
                            <input style={{cursor: 'pointer',fontSize: '13pt'}}  {...name} id="login" className={style.input} type="text" name="login"
                                   autoFocus/>
                            <span className="errorLogin"></span>

                            <div>Описание</div>
                            <BootstrapTextField {...description} style={{height: '160px'}} className={style.input} multiline
                                                rows={6}/>
                            <span className="errorPass"></span>

                            <div>Главные герои</div>
                            <input style={{fontSize: '13pt'}} {...partners} className={style.input} type="text"/>
                            <span className="errorPass2"></span>
                            <div>Жанры</div>
                            <BootstrapAutocomplete
                                multiple
                                style={{height: 'auto'}}
                                options={genresD}
                                className={style.input}
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
                                className={style.input}
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
                            <div className={style.age}>
                                <div>
                                    <div>Возраст</div>
                                    <Select
                                        value={age}
                                        label="Age"
                                        onChange={handleChange}
                                        className={style.input}
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
                            <input onClick={create} style={{margin: '0 40% 20px'}} className={style.submit} type="submit" name="submit"
                                   value="Создать"/>

                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default CreateStory;

const top100Films = [
    {title: 'The Shawshank Redemption', year: 1994},
    {title: 'The Godfather', year: 1972},
    {title: 'The Godfather: Part II', year: 1974},
    {title: 'The Dark Knight', year: 2008},
    {title: '12 Angry Men', year: 1957},
    {title: "Schindler's List", year: 1993},
    {title: 'Pulp Fiction', year: 1994},
    {
        title: 'The Lord of the Rings: The Return of the King',
        year: 2003,
    },
    {title: 'The Good, the Bad and the Ugly', year: 1966},
    {title: 'Fight Club', year: 1999},
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        year: 2001,
    },
    {
        title: 'Star Wars: Episode V - The Empire Strikes Back',
        year: 1980,
    },
    {title: 'Forrest Gump', year: 1994},
    {title: 'Inception', year: 2010},
    {
        title: 'The Lord of the Rings: The Two Towers',
        year: 2002,
    },
    {title: "One Flew Over the Cuckoo's Nest", year: 1975},
    {title: 'Goodfellas', year: 1990},
    {title: 'The Matrix', year: 1999},
    {title: 'Seven Samurai', year: 1954},
    {
        title: 'Star Wars: Episode IV - A New Hope',
        year: 1977,
    },
    {title: 'City of God', year: 2002},
    {title: 'Se7en', year: 1995},
    {title: 'The Silence of the Lambs', year: 1991},
    {title: "It's a Wonderful Life", year: 1946},
    {title: 'Life Is Beautiful', year: 1997},
    {title: 'The Usual Suspects', year: 1995},
    {title: 'Léon: The Professional', year: 1994},
    {title: 'Spirited Away', year: 2001},
    {title: 'Saving Private Ryan', year: 1998},
    {title: 'Once Upon a Time in the West', year: 1968},
    {title: 'American History X', year: 1998},
    {title: 'Interstellar', year: 2014},
    {title: 'Casablanca', year: 1942},
    {title: 'City Lights', year: 1931},
    {title: 'Psycho', year: 1960},
    {title: 'The Green Mile', year: 1999},
    {title: 'The Intouchables', year: 2011},
    {title: 'Modern Times', year: 1936},
    {title: 'Raiders of the Lost Ark', year: 1981},
    {title: 'Rear Window', year: 1954},
    {title: 'The Pianist', year: 2002},
    {title: 'The Departed', year: 2006},
    {title: 'Terminator 2: Judgment Day', year: 1991},
    {title: 'Back to the Future', year: 1985},
    {title: 'Whiplash', year: 2014},
    {title: 'Gladiator', year: 2000},
    {title: 'Memento', year: 2000},
    {title: 'The Prestige', year: 2006},
    {title: 'The Lion King', year: 1994},
    {title: 'Apocalypse Now', year: 1979},
    {title: 'Alien', year: 1979},
    {title: 'Sunset Boulevard', year: 1950},
    {
        title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
        year: 1964,
    },
    {title: 'The Great Dictator', year: 1940},
    {title: 'Cinema Paradiso', year: 1988},
    {title: 'The Lives of Others', year: 2006},
    {title: 'Grave of the Fireflies', year: 1988},
    {title: 'Paths of Glory', year: 1957},
    {title: 'Django Unchained', year: 2012},
    {title: 'The Shining', year: 1980},
    {title: 'WALL·E', year: 2008},
    {title: 'American Beauty', year: 1999},
    {title: 'The Dark Knight Rises', year: 2012},
    {title: 'Princess Mononoke', year: 1997},
    {title: 'Aliens', year: 1986},
    {title: 'Oldboy', year: 2003},
    {title: 'Once Upon a Time in America', year: 1984},
    {title: 'Witness for the Prosecution', year: 1957},
    {title: 'Das Boot', year: 1981},
    {title: 'Citizen Kane', year: 1941},
    {title: 'North by Northwest', year: 1959},
    {title: 'Vertigo', year: 1958},
    {
        title: 'Star Wars: Episode VI - Return of the Jedi',
        year: 1983,
    },
    {title: 'Reservoir Dogs', year: 1992},
    {title: 'Braveheart', year: 1995},
    {title: 'M', year: 1931},
    {title: 'Requiem for a Dream', year: 2000},
    {title: 'Amélie', year: 2001},
    {title: 'A Clockwork Orange', year: 1971},
    {title: 'Like Stars on Earth', year: 2007},
    {title: 'Taxi Driver', year: 1976},
    {title: 'Lawrence of Arabia', year: 1962},
    {title: 'Double Indemnity', year: 1944},
    {
        title: 'Eternal Sunshine of the Spotless Mind',
        year: 2004,
    },
    {title: 'Amadeus', year: 1984},
    {title: 'To Kill a Mockingbird', year: 1962},
    {title: 'Toy Story 3', year: 2010},
    {title: 'Logan', year: 2017},
    {title: 'Full Metal Jacket', year: 1987},
    {title: 'Dangal', year: 2016},
    {title: 'The Sting', year: 1973},
    {title: '2001: A Space Odyssey', year: 1968},
    {title: "Singin' in the Rain", year: 1952},
    {title: 'Toy Story', year: 1995},
    {title: 'Bicycle Thieves', year: 1948},
    {title: 'The Kid', year: 1921},
    {title: 'Inglourious Basterds', year: 2009},
    {title: 'Snatch', year: 2000},
    {title: '3 Idiots', year: 2009},
    {title: 'Monty Python and the Holy Grail', year: 1975},
];