import React from 'react';
import MainLayout from "./../../layouts/MainLayout";
import Chats from "./../../components/Chats";

const Index = () => {
    return (
        <MainLayout obj='Messages'>
            <Chats/>
        </MainLayout>
    );
};

export default Index;