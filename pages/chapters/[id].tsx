import React from 'react';
import Chapter from "./../../components/Chapter";
import MainLayout from "./../../layouts/MainLayout";
import Comments from "./../../components/Comments";
import {GetServerSideProps} from "next";
import axios from "axios";

const Index = ({chapter}) => {
    return (
        <div>
            <MainLayout>
                <Chapter chapter={chapter}/>
            </MainLayout>
        </div>
    );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const response = await axios.get('http://localhost:9000/chapters/' + params.id)
    return {
        props: {
            chapter: response.data
        }
    }
}