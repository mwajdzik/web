const getBtn = document.getElementById('get-btn');
const postBtn = document.getElementById('post-btn');

function sendHttpRequest(method, url, payload) {
    const config = {
        method: method,
        body: JSON.stringify(payload),
        headers: payload ? {'Content-Type': 'application/json'} : {}
    };

    fetch(url, config)
        .then(response => {
            if (response.status >= 400) {
                response.json().then(errResponse => {
                    throw new Error(errResponse);
                });
            } else {
                return response.json();
            }
        });
}

const getData = () => {
    sendHttpRequest('GET', 'https://reqres.in/api/users')
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.log(err);
        });
};

const sendData = () => {
    const payload = {email: 'eve.holt@reqres.in', password: 'pistol'};
    sendHttpRequest('POST', 'https://reqres.in/api/register', payload)
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        });
};

getBtn.addEventListener('click', getData);
postBtn.addEventListener('click', sendData);
