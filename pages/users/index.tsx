import React, {useEffect, useState} from 'react';
import Profile from "../../components/Profile";
import {GetServerSideProps} from "next";
import axios from "axios";
import MainLayout from "../../layouts/MainLayout";
import {useRouter} from "next/router";

const Index = () => {
    const [user, setUser] = useState({})
    const router = useRouter()

    useEffect(() => {
        async function fetchMyAPI() {
            const id = localStorage.getItem('id')
            if(!id)
                router.push('/authorization/')

            const response = await axios.get('http://localhost:9000/users/' + id)
            setUser(response.data)
        }

        fetchMyAPI()
    }, [])
    return (
        <MainLayout obj='Profile'>
            <Profile user={user} isMyProfile={true}/>
        </MainLayout>
    );
};

export default Index;

