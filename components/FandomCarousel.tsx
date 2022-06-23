// @ts-nocheck
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { styled } from "@mui/material/styles";
import * as React from "react";

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
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import {useRouter} from "next/router";
import axios from "axios";

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 1,
        width: '100vw',
        height: '100vh'
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
        width: '100vw',
        height: '100vh'
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1,
        width: '50vw',
        height: '50vh'
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        width: '50vw',
        height: '50vh'
    },
};

const responsiveCard = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 5,
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 3,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2,
    },
};

// const useStyles = makeStyles((theme) => ({
//     root: {
//         "& > *": {
//             margin: theme.spacing(1),
//         },
//     },
// }));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
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
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

const Img = styled("img")(({ theme }) =>({
    [theme.breakpoints.down('md')]: {
        margin: "auto",
        display: "block",
        width: '100vw',
        objectFit: "cover",
        height: '50vh',
    },
    [theme.breakpoints.up('md')]: {
        margin: "auto",
        display: "block",
        width: '100vw',
        objectFit: "cover",
        height: '100vh'
    },
    [theme.breakpoints.up('lg')]: {
        margin: "auto",
        display: "block",
        width: '100vw',
        objectFit: "cover",
        height: '100vh'
    }
}));


const Root = styled('div')(({ theme }) => ({
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

export const FandomCarousel = (props) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const router = useRouter();
    const [requests, setRequests] = React.useState([{image: '', id:''},{image: '', id:''},{image: '', id:''},{image: '', id:''}]);

    React.useEffect(() => {
        async function fetchMyAPI() {
            const response = await axios.get('http://localhost:9000/fandoms', )
            setRequests(response.data)
        }

        fetchMyAPI()
    }, [])
    // const classes = useStyles();
    return (
        <Root className="slider-for-fanfic">
            <Box>
                <Carousel
                    swipeable={true}
                    arrows={true}
                    draggable={true}
                    responsive={responsive}
                    ssr={true} // means to render carousel on server-side.
                    infinite={true}
                    //   autoPlay={props.deviceType !== "mobile" ? true : false}
                    autoPlay={false}
                    autoPlaySpeed={5000}
                    keyBoardControl={true}
                    customTransition="all .5"
                    transitionDuration={500}
                    containerClass="carousel-container"
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                    deviceType={props.deviceType}
                    dotListClass="custom-dot-list-style"
                    itemClass="carousel-item-padding-40-px"
                >
                    <Button onClick={() => router.push('/fandoms/' + requests[0].id)}>
                        <div>
                            <Img src={"http://localhost:9000/"+requests[0].image } alt="" />
                        </div>
                    </Button>
                    <Button onClick={() => router.push('/fandoms/' + requests[1].id)}>
                        <div>
                            <Img src={"http://localhost:9000/"+requests[1].image } alt="" />
                        </div>
                    </Button>
                    <Button onClick={() => router.push('/fandoms/' + requests[2].id)}>
                        <div>
                            <Img src={"http://localhost:9000/"+requests[2].image } alt="" />
                        </div>
                    </Button>
                    <Button onClick={() => router.push('/fandoms/' + requests[3].id)}>
                        <div>
                            <Img src={"http://localhost:9000/"+requests[3].image } alt="" />
                        </div>
                    </Button>
                </Carousel>
            </Box>
        </Root>
    );
};

