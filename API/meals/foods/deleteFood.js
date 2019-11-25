export default async function deleteFood(token, mealId, foodId) {
    let myHeaders = new Headers();
    myHeaders.append("x-access-token", token);
    myHeaders.append("Content-Type", "application/json");

    let requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
    };

    let response = await fetch(`https://mysqlcs639.cs.wisc.edu/meals/${mealId}/foods/${foodId}`, requestOptions);
    let response_json = await response.json();
    return response_json;
}