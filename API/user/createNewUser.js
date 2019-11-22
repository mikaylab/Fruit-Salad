async function createNewUser(username, password) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let rawData = JSON.stringify({username: username, password: password});

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: rawData,
        redirect: 'follow'
    };
    let response = await fetch('https://mysqlcs639.cs.wisc.edu/users/', requestOptions);
    let response_json = await response.json();

    return response_json;
}
export default createNewUser;