// @ts-nocheck
import React from 'react';
import style from './../styles/Search.module.scss'
import SearchIcon from '@mui/icons-material/Search';

const Search = () => {
    return (
        <div>
            <div className={style.search}>
                <SearchIcon style={{padding: 5}}/>
                {/*<img src={"../static/images/search.svg"}/>*/}
                <input type="search" className="searchText"/>
                <div className={style.display}></div>
            </div>
        </div>
    );
};

export default Search;