export default async function updateMeal(fields, token, id) {
    let myHeaders = new Headers();
    myHeaders.append("x-access-token", token);
    myHeaders.append("Content-Type", "application/json");

    let rawData = JSON.stringify(fields);

    let requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: rawData,
    redirect: 'follow'
    };

    let response = await fetch(`https://mysqlcs639.cs.wisc.edu/meals/${id}`, requestOptions);
    let response_json = await response.json();
    return response_json;
}