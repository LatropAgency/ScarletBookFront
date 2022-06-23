import React, {useEffect, useState} from 'react';
import axios from "axios";
import EditProfile from '../../components/EditProfile';
import MainLayout from "../../layouts/MainLayout";

const Edit = () => {
    const [user, setUser] = useState({})

    useEffect(() => {
        async function fetchMyAPI() {
            const id = localStorage.getItem('id')
            const response = await axios.get('http://localhost:9000/users/' + id)
            setUser(response.data)
        }

        fetchMyAPI()
    }, [])
    return (
        <MainLayout obj='Profile'>
            <EditProfile user={user}/>
        </MainLayout>
    );
};

export default Edit;