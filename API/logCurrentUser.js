import base64 from 'base-64';
async function loginCurrentUser(username, password) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Basic " + base64.encode(username + ":" + password));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    let response = await fetch('https://mysqlcs639.cs.wisc.edu/login', requestOptions);
    let response_json = await response.json();
    return response_json;
}
export default loginCurrentUser;