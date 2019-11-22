export default async function deleteMeal(token, id) {
    let myHeaders = new Headers();
    myHeaders.append("x-access-token", token);
    myHeaders.append("Content-Type", "application/json");

    let requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
    };

    let response = await fetch(`https://mysqlcs639.cs.wisc.edu/meals/${id}`, requestOptions);
    let response_json = await response.json();
    return response_json;
}