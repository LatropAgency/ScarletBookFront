import React, {useState} from 'react';
import {GetServerSideProps} from "next";
import axios from "axios";
import Profile from "./../../components/Profile";
import {useRouter} from "next/router";
import MainLayout from "./../../layouts/MainLayout";

const Id = ({serverUser}) => {
    const [user, setUser] = useState(serverUser)
    const router = useRouter()
    let isMyProfile = false;
    if (typeof window !== 'undefined') {
        // Perform localStorage action
        const id = localStorage.getItem('id')
        isMyProfile = id === user.id
    }
    return (
        <MainLayout obj={isMyProfile ? 'Profile' : ''}>
            <Profile user={user} isMyProfile={isMyProfile}/>
        </MainLayout>
    );
};

export default Id;

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const response = await axios.get('http://localhost:9000/users/' + params.id)
    return {
        props: {
            serverUser: response.data
        }
    }
}