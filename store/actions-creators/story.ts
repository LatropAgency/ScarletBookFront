import {Dispatch} from "react";
import {StoryAction, StoryActionTypes} from "./../../types/story";
import axios from "axios";

export const fetchStories = () => {
    return async (dispatch: Dispatch<StoryAction>) => {
        try {
            const response = await axios.get('http://localhost:9000/stories')
            dispatch({type: StoryActionTypes.FETCH_STORIES, payload: response.data})
        } catch (e) {
            dispatch({
                type: StoryActionTypes.FETCH_STORIES_ERROR,
                payload: 'Произошла ошибка при загрузке'})
        }
    }
}
