const getBtn = document.getElementById('get-btn');
const postBtn = document.getElementById('post-btn');

const sendHttpRequest = (method, url, data) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.responseType = 'json';

        if (data) {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }

        xhr.onload = function () {
            if (xhr.status >= 400) {
                reject(xhr.response);
            } else {
                resolve(xhr.response);
            }
        };

        // fails in connection problems
        xhr.onerror = function () {
            reject('Error!');
        };

        xhr.send(JSON.stringify(data));
    });
};

const getData = () => {
    sendHttpRequest('GET', 'https://reqres.in/api/users')
        .then(data => {
            console.log(data);
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
