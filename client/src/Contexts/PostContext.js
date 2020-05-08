import React, {createContext, useReducer, useMemo, useContext} from "react";

const PostContext = createContext();

const initialState = {
    posts: []
}

const reducer = (state, action) => {
    switch(action.type){
        case 'UPDATE_POSTS':
            return {
                ...state,
                posts: action.payload
            }
        default:
            return state;
    }
}

export const PostStoreProvider = ({children}) => {
    const [store, dispatch ] = useReducer(reducer, initialState);
    const contextValue = useMemo(() => [store, dispatch], [store, dispatch]);

    return (
        <PostContext.Provider value={contextValue}>
            {children}
        </PostContext.Provider>
    );
}

export function usePostStore() {
    return useContext(PostContext);
}