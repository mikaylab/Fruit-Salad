export default async function getFoodLibrary() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
    let response = await fetch('https://mysqlcs639.cs.wisc.edu/foods', requestOptions);
    let response_json = await response.json();
    return response_json;
}