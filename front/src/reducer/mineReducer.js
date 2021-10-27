const defaultState = {
    userid: 1,
    activegame: false,
    bet: 0,
    mineid: 0,
    value: 3,
    output: ""
};

export const mineReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "INFO_FETCH_DATA_SUCCESS": {
            console.log("ACTIONRESULT");
            console.log(action.result);
            return Object.assign({}, state,action.result);
        }
        case "ASSIGN_STATE": {
            return Object.assign({}, state,action.object);
        }
        default:
            return state;
    }
}