const defaultState = {auth: false}

const userLogOutReducer = (state=defaultState, action) => {
    switch (action.type) {
        case "LOGIN":
            return {...state, auth: true, username: action.username}
        case "LOGOUT":
            return {...state, auth: false, username: ''}
        case "POST_LIST":
            return {
                ...state,
                postsList: action.postsList,
                count: action.count,
                nextPage: action.nextPage,
                prevPage: action.prevPage
            }
        case "POST_DETAIL":
            return {
                ...state,
                post: action.post,
                tags: action.tags,
                comments: action.comments,
                author: action.author,
            }
        case "ADD_REPLY":
            return {...state, comments: action.comments}
        default:
            return state
    }
}

export default userLogOutReducer