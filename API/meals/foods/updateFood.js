export default async function updateMeal(fields, token, mealId, foodId) {
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

    let response = await fetch(`https://mysqlcs639.cs.wisc.edu/meals/${mealId}/foods/${foodId}`, requestOptions);
    let response_json = await response.json();
    return response_json;
}