import React, {useState} from 'react';
import Chapter from "../../components/Chapter";
import MainLayout from "../../layouts/MainLayout";
import Story from "../../components/Story";
import {GetServerSideProps} from "next";
import axios from "axios";
import {useRouter} from "next/router";
import Comments from "../../components/Comments";

const StoryPage = ({serverStory}) => {
    const [story, setTrack] = useState(serverStory)
    const router = useRouter()
    return (
        <MainLayout>
            <Story story={story}/>
        </MainLayout>
    );
};

export default StoryPage;

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const response = await axios.get('http://localhost:9000/stories/' + params.id)
    return {
        props: {
            serverStory: response.data
        }
    }
}