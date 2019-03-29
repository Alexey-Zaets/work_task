const defaultState = {auth: false,}

const userLogOutReducer = (state=defaultState, action) => {
    switch (action.type) {
        case "LOGIN":
            return {...state, auth: true}
        default:
            return state
    }
}

export default userLogOutReducer