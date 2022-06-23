// @ts-nocheck
import React from 'react';
import {BottomNavigation, BottomNavigationAction, Paper} from "@mui/material";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import EmailIcon from '@mui/icons-material/Email';
import {useRouter} from "next/router";

function RestoreIcon() {
    return null;
}

const NavbarMobile = ({state}) => {
    const router = useRouter();
    const [value, setValue] = React.useState(state);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <div>
            <Paper sx={{position: 'fixed', top: 0, left: 0, right: 0, zIndex: '10000'}} elevation={3}>
                <BottomNavigation value={value} onChange={handleChange} sx={{color: 'red'}}>
                    <img
                        height='103px'
                        onClick={() => router.push('/')}
                        src='../static/images/logo3.svg'
                        alt=''
                    />
                </BottomNavigation>
            </Paper>
            <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: '10000'}} elevation={5}>
                <BottomNavigation value={value} onChange={handleChange} sx={{color: 'red'}}>
                    <BottomNavigationAction
                        sx={{minWidth: '60px'}}
                        onClick={() => router.push('/')}
                        value="home"
                        icon={value === "home" ? <HomeIcon sx={{color: '#A01010'}} fontSize='large'/> : <HomeOutlinedIcon fontSize='large'/>}
                    />
                    <BottomNavigationAction
                        sx={{minWidth: '60px'}}
                        onClick={() => router.push('/story/marks')}
                        value="marks"
                        icon={value === "marks" ? <BookmarkIcon sx={{color: '#A01010'}} fontSize='large'/> : <BookmarkBorderIcon fontSize='large'/>}
                    />
                    <BottomNavigationAction
                        sx={{minWidth: '60px'}}
                        onClick={() => router.push('/search/')}
                        value="Search"
                        icon={value === "Search" ? <SearchOutlinedIcon sx={{color: '#A01010'}} fontSize='large'/> : <SearchOutlinedIcon fontSize='large'/>}
                    />
                    <BottomNavigationAction
                        sx={{minWidth: '60px'}}
                        onClick={() => router.push('/infolist/')}
                        value="Info"
                        icon={value === "Info" ? <HelpOutlineIcon sx={{color: '#A01010'}} fontSize='large'/> : <HelpOutlineIcon fontSize='large'/>}
                    />
                    <BottomNavigationAction
                        sx={{minWidth: '60px'}}
                        onClick={() => router.push('/messages/')}
                        value="Messages"
                        icon={value === "Messages" ? <EmailIcon sx={{color: '#A01010'}} fontSize='large'/> : <EmailOutlinedIcon fontSize='large'/>}
                    />
                    <BottomNavigationAction
                        sx={{minWidth: '60px'}}
                        onClick={() => router.push('/users/')}
                        value="Profile"
                        icon={value === "Profile" ? <AccountCircleIcon sx={{color: '#A01010'}} fontSize='large'/> :
                            <AccountCircleOutlinedIcon fontSize='large'/>}
                    />
                </BottomNavigation>
            </Paper>
        </div>
    );
};

export default NavbarMobile;