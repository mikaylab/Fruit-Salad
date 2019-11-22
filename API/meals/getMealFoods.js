export default function getMealFoods(token, id) {
    let myHeaders = new Headers();
    myHeaders.append("x-access-token", token);
    myHeaders.append("Content-Type", "application/json");

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    let response = await fetch(`https://mysqlcs639.cs.wisc.edu/meals/${id}/foods`, requestOptions);
    let response_json = await response.json();
    return response_json;
}