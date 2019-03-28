const defaultState = {haveToken: false}

const userLogOutReducer = (state=defaultState, action) => {
    switch (action.type) {
        case "LOGIN":
            return {...state, haveToken: true}
        default:
            return state
    }
}

export default userLogOutReducer