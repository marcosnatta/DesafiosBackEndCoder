function changeUserRole() {
    const userId = document.getElementById('userId').value;
    const role = document.getElementById('role').value;

    const url = `session/users/premium/${userId}`;

    const data = {
        role: role
    };
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        document.getElementById('result').innerHTML = result.message;
    })
    .catch(error => {
        console.error('Error al cambiar el rol del usuario:');
        document.getElementById('result').innerHTML = 'Error al cambiar el rol del usuario.';
    });
}