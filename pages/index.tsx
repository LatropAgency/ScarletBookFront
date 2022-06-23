import React, {useState} from 'react';
import {FandomCarousel} from "../components/FandomCarousel";
import MainLayout from "../layouts/MainLayout";
import {NextThunkDispatch, wrapper} from "../store";
import {fetchStories} from "../store/actions-creators/story";
import {useRouter} from "next/router";
import {useTypedSelector} from "../hooks/useTypedSelector";
import {CarouselFanfic} from "../components/carouselFanfic";
import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";
// import {CarouselFandom} from '../components/carousalFandom';



const Index = () => {
    const router = useRouter()
    const {stories, error} = useTypedSelector(state => state.story)
    return (
        <div>
            <div>
                <MainLayout obj='home'>
                    <FandomCarousel/>
                    <CarouselFanfic story={stories} orientation='get'/>
                    <CarouselFanfic story={stories} orientation='slesh'/>
                    <CarouselFanfic story={stories} orientation='femslesh'/>
                </MainLayout>
            </div>
            {/*<FilterBar/>*/}
            {/*<FandomCarousel/>*/}
            {/*<SearchItem/>*/}
            {/*<Story/>*/}
            {/*<Comments/>*/}
            {/*<Chapter/>*/}
            {/*<CreateStory/>*/}
            {/*<EditProfile/>*/}
            {/*<Profile/>*/}
            {/*<Chats/>*/}
            {/*<AdministrationPanel/>*/}
        </div>
    );
};

export default Index;


export const getServerSideProps = wrapper.getServerSideProps(async ({store}) => {
    const dispatch = store.dispatch as NextThunkDispatch
    await dispatch(await fetchStories())
})