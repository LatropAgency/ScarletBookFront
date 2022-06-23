interface IGenre {
    name: string
}

interface IChapter {
    id: number,
    name: string,
    text: string
}

interface IStory {
    id: number,
    name: string,
    image: string,
    authorImg: string,
    authorLogin: string,
    likes: number,
    chaptersCount: number,
    status: string,
    genres: IGenre[],
    description: string,
    chapters: IChapter[]
}

export interface StoryState {
    stories: IStory[];
    error: string;
}

export enum StoryActionTypes {
    FETCH_STORIES = 'FETCH_STORIES',
    FETCH_STORIES_ERROR = 'FETCH_STORIES_ERROR',
}

interface FetchStoryAction {
    type: StoryActionTypes.FETCH_STORIES;
    payload: IStory[]
}

interface FetchStoryErrorAction {
    type: StoryActionTypes.FETCH_STORIES_ERROR;
    payload: string
}

export type StoryAction = FetchStoryAction | FetchStoryErrorAction