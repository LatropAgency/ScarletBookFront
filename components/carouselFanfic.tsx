// @ts-nocheck
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {styled} from "@mui/material/styles";
import * as React from "react";
import style from './../styles/Modal.module.scss';
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ListIcon from "@mui/icons-material/List";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import {useRouter} from "next/router";
import {
    ProvideMediaMatchers,
    MediaMatcher,
    MediaMatches,
    createMediaMatcher,
} from "react-media-match";

import {breakpoints, hover} from "react-media-match/dist/es2019/targets";
import {useInput} from "../hooks/useInput";
import axios from "axios";
import {useState} from "react";

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: {max: 4000, min: 3000},
        items: 5,
    },
    desktop: {
        breakpoint: {max: 3000, min: 1024},
        items: 4,
    },
    tablet: {
        breakpoint: {max: 1024, min: 464},
        items: 3,
    },
    mobile: {
        breakpoint: {max: 464, min: 0},
        items: 2,
    },
};


const BootstrapDialog = styled(Dialog)(({theme}) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const {children, onClose, ...other} = props;

    return (
        <DialogTitle sx={{m: 0, p: 2}} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
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

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

const Root = styled('div')(({theme}) => ({
    padding: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
        height: '50vh',
    },
    [theme.breakpoints.up('md')]: {
        height: '100vh'
    },
    [theme.breakpoints.up('lg')]: {
        height: '100vh'
    },
}));

export const CarouselFanfic = ({props, story, orientation}) => {
    const [open, setOpen] = React.useState(false);
    const [activeStory, setActiveStory] = React.useState(story[0]);
    const [like, setLike] = React.useState({isActive: false, count: 0});
    const [marks, setMarks] = React.useState({isActive: false});
    const [chapters, setChapters] = React.useState(0)
    const [stories, setStories] = useState([])
    const [img, setImg] = useState('')

    React.useEffect(() => {
        async function fetchMyAPI() {
            const response = await axios.get('http://localhost:9000/stories', { params: { orientation: orientation } })
            setStories(response.data);
        }

        fetchMyAPI()
    }, [])

    let token ='';
    if (typeof window !== 'undefined') {
        // Perform localStorage action
        token = localStorage.getItem('token');
    }

    const router = useRouter();

    const handleClickOpen = (story) => {
        if(token) {
            axios.get('http://localhost:9000/stories/' + story.story.id + '/likeInfo', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(resp => {
                    setLike(resp.data);
                })
                .catch(e => console.log(e.message))
            axios.get('http://localhost:9000/stories/' + story.story.id + '/markInfo', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
                .then(resp => {
                    setMarks(resp.data);
                })
                .catch(e => console.log(e.message))
        }else{setLike(story.story.likes.length)}
        axios.get('http://localhost:9000/chapters/storyId/' + story.story.id).then(resp => setChapters(resp.data.length))
        setActiveStory(story);
        setImg(story.image)
        setOpen(true);
    };
    const addLike = () =>{
        if(activeStory){
            if(token) {
                // @ts-ignore
                axios.get('http://localhost:9000/stories/' + activeStory.story.id + '/like', {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                    .then(resp => {
                        // @ts-ignore
                        axios.get('http://localhost:9000/stories/' + activeStory.story.id + '/likeInfo', {
                            headers: {
                                Authorization: 'Bearer ' + token
                            }
                        })
                            .then(resp => {
                                setLike(resp.data);
                            })
                    })
            }else(router.push('/authorization/'))
        }
    }

    const addMark = () =>{
        if(activeStory){
            if(token) {
                // @ts-ignore
                axios.get('http://localhost:9000/stories/' + activeStory.story.id + '/mark', {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                    .then(resp => {
                        // @ts-ignore
                        axios.get('http://localhost:9000/stories/' + activeStory.story.id + '/markInfo', {
                            headers: {
                                Authorization: 'Bearer ' + token
                            }
                        })
                            .then(resp => {
                                setMarks(resp.data);
                            })
                    })
            }else(router.push('/authorization/'))
        }
    }

    const handleClose = () => {
        setOpen(false);
    };
    // @ts-ignore
    return (
        <Root className={orientation === 'get' ? style.sliderForFanfic : orientation ==='slesh' ? style.sliderForFanficSlesh : style.sliderForFanficFem}>
            <div className={style.example2}>
            <div className={style.example}>
                {orientation==='get'?<h3>Популярные Гет произведения</h3>: orientation==='slesh'?<h3>Популярные Слеш произведения</h3>:<h3>Популярные Фемслеш произведения</h3>}
                <Carousel
                    swipeable={true}
                    arrows={true}
                    draggable={true}
                    responsive={responsive}
                    ssr={true} // means to render carousel on server-side.
                    infinite={true}
                    //   autoPlay={props.deviceType !== "mobile" ? true : false}
                    autoPlay={false}
                    autoPlaySpeed={7000}
                    keyBoardControl={true}
                    customTransition="all .5"
                    transitionDuration={500}
                    containerClass="carousel-container"
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                    // deviceType={props.deviceType}
                    dotListClass="custom-dot-list-style"
                    itemClass="carousel-item-padding-40-px"
                >
                    {stories.map(story => {
                        // @ts-ignore
                        // @ts-ignore
                        // @ts-ignore
                        // @ts-ignore
                        // @ts-ignore
                        // @ts-ignore
                        return (
                            <div>
                                <Button className={style.visibleMob} onClick={() => router.push(`/story/${story.id}`)}>
                                    <img className={style.imgCard} src={'http://localhost:9000/' + story.image} alt=""/>
                                </Button>
                                <Button className={style.visible} onClick={() => handleClickOpen({story})}>
                                    <div className={style.effects}>
                                        <img className={style.imgCard} src={'http://localhost:9000/' + story.image} alt=""/>
                                            <div>
                                                <h2>{story.name}</h2>
                                            </div>
                                    </div>
                                </Button>
                                <Stack className={style.stack} direction="row" justifyContent="center" alignItems="center" flexWrap="wrap" spacing={1} responsive={true}>                                    {story.genres.map((genre, index) =>                                        index < 2 ?                                        <Chip                                            label={genre.name}                                            component="a"                                            onClick={() => router.push('/genres/'+genre.id)}                                            clickable                                            size="small"                                            style={{margin: '0.2em'}}                                        /> : ''                                    )}                                </Stack>

                            </div>
                        )
                    })}


                    <BootstrapDialog
                        onClose={handleClose}
                        aria-labelledby="customized-dialog-title"
                        open={open}
                    >
                        <div className={orientation === 'get' ? style.boxBlogGet : orientation === 'slesh' ? style.boxBlogSlesh : style.boxBlogFem}>
                            <DialogContent dividers>
                                <BootstrapDialogTitle
                                    // @ts-ignore
                                    id="customized-dialog-title"
                                    onClose={handleClose}
                                />
                                <Box sx={{flexGrow: 1}}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={5}>
                                            <img className={style.img} src={`http://localhost:9000/${activeStory ? activeStory.story.image : ''}`}
                                                 alt=""/>
                                        </Grid>
                                        <Grid item xs={7}>
                                            <h2>{activeStory ? activeStory.story.name : ''}</h2>
                                            <div className={style.likes}>
                                                <div style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    padding: '0 8px 0 0'
                                                }}>{like.isActive ? <FavoriteIcon onClick={addLike} sx={{color: 'red', cursor: 'pointer'}}/> : <FavoriteIcon onClick={addLike} sx={{color: '#C9C9C9', cursor: 'pointer'}}/> }
                                                    <div>{activeStory ? activeStory.story.likes.length : '0'}</div>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    padding: '0 8px 0 0'
                                                }}><ListIcon sx={{color: '#C9C9C9'}}/>
                                                    <div>{chapters}</div>
                                                </div>
                                                <div style={activeStory ? activeStory.story.status === 'Завершено' ? {background: '#C0D1C5'} : activeStory.story.status === 'Заморожено' ? {background: '#D7E1F2'} : {background: '#F5BDBD'}:{background: '#F5BDBD'}}  className={style.status}>{activeStory ? activeStory.story.status : ''}</div>
                                            </div>
                                            <Typography gutterBottom sx={{maxHeight: '245px', overflow: 'hidden'}}>
                                                {activeStory ? activeStory.story.description : ''}
                                            </Typography>
                                            <div className={style.ganresStory}>
                                                {activeStory ? activeStory.story.genres.map((genre, index) =>
                                                    <div style={{cursor: 'pointer'}} onClick={() => router.push('/genres/' + genre.id)}>{index < 4 ? genre.name : ''}</div>)  : ''}
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <DialogActions>
                                    <div className={style.readMark}>
                                        <button className={style.btn}
                                                onClick={() => router.push(`/story/${activeStory.story.id}`)}>Читать
                                        </button>
                                        {marks.isActive ? <BookmarkIcon onClick={addMark} sx={{color: 'red', cursor: 'pointer'}}/> : <BookmarkIcon onClick={addMark} sx={{color: '#C9C9C9', cursor: 'pointer'}}/> }
                                    </div>
                                </DialogActions>
                            </DialogContent>
                        </div>
                    </BootstrapDialog>
                </Carousel>
            </div>
            </div>
        </Root>
    );
};
