const defaultState = {auth: false,}

const userLogOutReducer = (state=defaultState, action) => {
    switch (action.type) {
        case "LOGIN":
            return {...state, auth: true}
        case "LOGOUT":
            return {...state, auth: false}
        default:
            return state
    }
}

export default userLogOutReducer