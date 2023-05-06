const ul = document.querySelector('ul')
const form = document.querySelector('form')
const nameInputField = document.querySelector('#name')
const emailInputField = document.querySelector('#email')
const numberInputField = document.querySelector('#number')
const addOrEdit = document.querySelector('.add-edit')
const cancelEdit = document.querySelector('.cancel-edit')
console.log(nameInputField, emailInputField, numberInputField)

const deleteUser = id => {
    fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE"
    })
}

const cancelEditing = editedUserList => {
    console.log('kfdaslkfj')
    form.reset()
    cancelEdit.classList.toggle('d-none');
    addOrEdit.value = 'Add User'
    editedUserList.classList.toggle('currently-edited')
    editedUserList && (
        editedUserList.querySelectorAll('button')
            .forEach(button => button.disabled = false)
    )
    form.onsubmit = addUserData
}

const editUser = id => {
    const editedUserList = document.querySelector(`li[data-id="${id}"]`)
    console.log(editedUserList)
    editedUserList && (editedUserList.classList.toggle('currently-edited'))
    editedUserList && (
        editedUserList.querySelectorAll('button')
            .forEach(button => button.disabled = true)
    )
    addOrEdit.value = 'Edit User'
    cancelEdit.classList.toggle('d-none');
    
    cancelEdit.onclick = () => cancelEditing(editedUserList)
    
    
    fetch(`http://localhost:3000/users/${id}`)
        .then(data => data.json())
        .then(({ name, email, number }) => {
            nameInputField.value = name
            emailInputField.value = email
            numberInputField.value = number
            form.onsubmit = (e) => {
                e.preventDefault()
                console.log('this is cool bro from edit section ')
                if (
                    nameInputField.value === name &&
                    emailInputField.value === email &&
                    numberInputField.value === number
                ) {
                    alert('you havent changed anything')
                    return false
                }
                fetch(`http://localhost:3000/users/${id}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: nameInputField.value,
                        email: emailInputField.value,
                        number: numberInputField.value
                    })
                })
            }
        })
}

fetch("http://localhost:3000/users")
    .then(data => data.json())
    .then(data => {
        data.forEach(({ id, name, email, number }) => {
            const user = `
                <li data-id="${id}">
                    <h2>${name}</h2>
                    <h4>${email}</h4>
                    <h4>${number}</h4>
                    <button data-id="${id}" class="edit">Edit</button>
                    <button data-id="${id}" class="delete">Delete</button>
                </li>
            `
            ul.innerHTML += user
        });
        const deleteUsers = document.querySelectorAll('.delete')
        const editUsers = document.querySelectorAll('.edit')
        deleteUsers.forEach(user => {
            user.onclick = () => {
                deleteUser(user.dataset.id)
            }
        })
        editUsers.forEach(user => {
            user.onclick = () => {
                editUser(user.dataset.id)
            }
        })

    })


const addUserData = (e) => {
    e.preventDefault()
    const formData = new FormData(form)
    const name = formData.get("name")
    const email = formData.get("email")
    const number = formData.get("number")
    fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            number: number
        })
    })
    console.log(name, email, number)

    return false
}

form.onsubmit = addUserData