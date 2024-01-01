async function changeUserRole() {
    const userId = document.getElementById('userId').value;
    const role = document.getElementById('role').value;

    const url = `/session/users/premium/${userId}`;

    const data = {
        role: role
    };

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log(result);
        document.getElementById('result').innerHTML = result.message;

        getUsers();
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        document.getElementById('result').innerHTML = `Error al cambiar el rol del usuario: ${error.message}`;
    }
}

async function getUsers() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    try {
        const response = await fetch('/session/users');
        const result = await response.json();

        if (result.users) {
            result.users.forEach(user => {
                const listItem = document.createElement('li');
                listItem.textContent = `ID: ${user._id}, Nombre: ${user.first_name}, Email: ${user.email}, Rol: ${user.role}`;
                userList.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
    }
}

async function deleteUser() {
    const deleteUserId = document.getElementById('deleteUserId').value;

    try {
        const response = await fetch(`/session/users/${deleteUserId}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        console.log(result);

        getUsers();

        document.getElementById('result').innerHTML = result.message;
    } catch (error) {
        console.error('Error al borrar el usuario:', error);
        document.getElementById('result').innerHTML = `Error al borrar el usuario: ${error.message}`;
    }
}

getUsers();
