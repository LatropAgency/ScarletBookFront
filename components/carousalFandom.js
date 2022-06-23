import React, { Component } from 'react';
import Carousel from '3d-react-carousal';

export const CarouselFandom = () =>{
    const slides = [
        <a href={"https://mail.google.com/mail/u/0/#inbox"}><img  src="https://picsum.photos/800/300/?random" alt="1" /></a>,
        <img  src="https://picsum.photos/800/301/?random" alt="2" />  ,
        <img  src="https://picsum.photos/800/302/?random" alt="3" />  ,
        <img  src="https://picsum.photos/800/303/?random" alt="4" />  ,
        <img src="https://picsum.photos/800/304/?random" alt="5" />   ];
    return (
        <Carousel slides = {slides} autoplay={true} interval={10000}/>
    );
}