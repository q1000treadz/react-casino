export async function callBackendAPI(request,data = {}) {
   // console.log("DATA");
   // console.log(data);
    const response = await fetch(request,data);
    console.log(response);
    if (response.status !== 200) {
        throw Error(body.message)
    }
    const body = await response.json();
    console.log(body);

    return body;
}