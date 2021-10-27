export function minesFetchDataSuccess(result) {
    console.log(result);
    return {
        type: "INFO_FETCH_DATA_SUCCESS",
        result
    }
}

export function minesFetchData(url, object) {
    console.log(url);
    console.log(object);
    return (dispatch) => {
        fetch(url, object).then(response => {
            console.log(response);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response;
        })
            .then(response => {console.log(response);let t = response.json();console.log("JSON");console.log(t); return t;})
            .then(result => {console.log(result);dispatch(minesFetchDataSuccess(result))});
    }
}

export function assignState(object) {
    return {
        type: "ASSIGN_STATE",
        object
    }
}