import base64 from 'base-64';
async function authUser(username, password, token) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", token);
    myHeaders.append("Authorization", "Basic " + base64.encode(username + ":" + password));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    let response = await fetch(`https://mysqlcs639.cs.wisc.edu/users/${username}`, requestOptions);
    let response_json = await response.json();
    return response_json;
}
export default authUser;