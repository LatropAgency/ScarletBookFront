import {Slider} from '@mui/material';
import React from 'react';
import style from '../styles/Chapter.module.scss'
import Comments from './Comments';
import useMediaQuery from "@mui/material/useMediaQuery";
import json2mq from 'json2mq';

const Chapter = ({chapter}) => {
    console.log(chapter)
    const [value, setValue] = React.useState<number>(18);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
    };
    const matches = useMediaQuery(
        json2mq({
            minWidth: 850,
        }),
    );
    let id = '';
    if (typeof window !== 'undefined') {
        // Perform localStorage action
        id = localStorage.getItem('id')
    }

    return (
        <div style={matches? {margin: '190px 0 0'}: {margin: '0'}} className={style.section}>
            <div className={style.container2}>
                <div className={style.slidecontainer}>
                    <Slider value={value}
                            sx={{
                                color: '#C9C9C9',
                                height: '15px',
                                borderRadius: '5px',
                                outline: 'none',
                                opacity: 0.7,
                                transition: 'opacity .2s',
                                '& .MuiSlider-track': {
                                    border: 'none',
                                },
                                '& .MuiSlider-thumb': {
                                    width: 24,
                                    height: 24,
                                    backgroundColor: '#A01010',
                                    '&:before': {
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                                    },
                                    '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                        boxShadow: 'none',
                                    },
                                },
                            }}
                            onChange={handleChange} min={6} max={50} aria-label="Default"/>
                    <div>{value}pt</div>
                </div>
                <div className={style.infoChapters}>
                    <div className={style.nameChapters}>{chapter.name}</div>
                    <div className={style.textChapters} style={{fontSize: `${value}pt`}}>
                        {chapter.text.split('\n').map((item, idx) => {
                            return (
                                <div>
                                    {item}
                                    <br/>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <button style={{margin: '20px 0 20px 0'}} className={style.button}>Перейти к оглавлению</button>
                </div>
            </div>
            <Comments comments={chapter.comments} userId={id} storyId={chapter.id} forStory={false}/>
        </div>
    );
};

export default Chapter;