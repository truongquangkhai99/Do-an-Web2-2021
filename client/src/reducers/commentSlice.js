import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import commentApi from 'src/api/commentApi';

export const getAllComments = createAsyncThunk('GET_COMMENT_MOVIE', async ({movieId, currentPage}) => {
    const stateReponse = await commentApi.getCommentMovie({movieId, currentPage});
    return stateReponse;
});

export const addComments = createAsyncThunk('ADD_COMMENT_MOVIE', async (data) => {
    const stateReponse = await commentApi.addComments(data);
    return stateReponse;
});

export const addFeedbackComments = createAsyncThunk('ADD_FEEDBACK_COMMENT_MOVIE', async (data) => {
    const stateReponse = await commentApi.addFeedbackComments(data);
    return stateReponse;
});

const commentSlice = createSlice({
    name: 'movie-comments',
    initialState: {
        loading: false,
        error: '',
        createStatus: 0,
        comments: [],
        totalPage: 0,
    },
    reducers: {
        defautlCreateStatus(state) {
            state.createStatus = 0;
        },
        clearComments(state) {
            state.comments = [];
        }
    },
    extraReducers: {
        [getAllComments.pending]: (state) => {
            state.loading = true;
        },
        [getAllComments.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [getAllComments.fulfilled]: (state, { payload }) => {
            state.loading = false;
            state.error = '';
            state.comments = state.comments.concat(payload.data);
            state.totalPage = payload.totalPage;
        },
        [addComments.pending]: (state) => {
            state.loading = true;
        },
        [addComments.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [addComments.fulfilled]: (state) => {
            state.loading = false;
            state.error = '';
            state.createStatus = 1;
        },
        [addFeedbackComments.pending]: (state) => {
            state.loading = true;
        },
        [addFeedbackComments.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [addFeedbackComments.fulfilled]: (state) => {
            state.loading = false;
            state.error = '';
            state.createStatus = 1;
        },
    }
});


const  { actions, reducer } = commentSlice;
export const { defautlCreateStatus, clearComments } = actions;
export default reducer;