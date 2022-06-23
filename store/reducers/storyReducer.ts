import {StoryAction, StoryActionTypes, StoryState} from "./../../types/story";

const initialState: StoryState = {
    stories: [],
    error: ''
}

export const storyReducer = (state = initialState, action: StoryAction): StoryState => {
    switch (action.type) {
        case StoryActionTypes.FETCH_STORIES_ERROR:
            return {...state, error: action.payload}
        case StoryActionTypes.FETCH_STORIES:
            return {error: '', stories: action.payload}
        default:
            return state
    }
}
