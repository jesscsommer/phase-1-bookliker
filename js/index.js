document.addEventListener("DOMContentLoaded", function() {});

const handleClick = (book) => {
    document.querySelector('#show-panel').innerText = "";

    const bookDetails = document.createElement('div')
    bookDetails.id = book.id

    const thumbnail = document.createElement('img')
    thumbnail.src = book['img_url']
    
    const title = document.createElement('h2')
    title.innerText = book.title

    const author = document.createElement('h2')
    author.innerText = book.author

    const description = document.createElement('p')
    description.innerText = book.description

    const listOfUsers = document.createElement('ul')
    for (let user of book.users){
        const userLike = document.createElement('li')
        userLike.innerText = user.username 
        listOfUsers.append(userLike)
    }

    const likeBtn = document.createElement('button')
    likeBtn.innerText = 'Like'
    likeBtn.addEventListener('click', (e) => {
        fetch(`http://localhost:3000/books/${book.id}`, {
            method: 'PATCH', 
            headers: {
                'Content-Type':'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                'users': [...book.users, 
                    {'id': 1, 'username': 'currentUserName'}
                ]
            })
        })
        .then(res => {
            if (res.ok) {
                return res.json()
            } else {
                throw res.statusText
            }
        })
        .then(data => {
            listOfUsers.innerHTML = ""
            for (let user of data.users){
                const userLike = document.createElement('li')
                userLike.innerText = user.username 
                listOfUsers.append(userLike)
            }
        })
        .catch(error => alert(error))
    })

    bookDetails.append(thumbnail, title, author, description, listOfUsers, likeBtn)
    document.querySelector('#show-panel').append(bookDetails)
}

// thumbnail, title, author, description, users who liked the book

// append elements with all the relevant info 
// if a different element is clicked --> show those 
// maybe create a new div for each book & put it inside the main div 
// then hide & show when you click back & forth (resets the #show-panel in order to do this)

fetch('http://localhost:3000/books')
.then(res => {
    if (res.ok) {
        return res.json()
    } else {
        throw (res.statusText)
    }
})
.then(allBooks => {
    allBooks.forEach(book => {
        const newBook = document.createElement('li')
        newBook.innerText = book.title
        newBook.addEventListener('click', () => { 
            handleClick(book)
        })
        document.querySelector('#list').append(newBook)
    })
})
.catch(error => alert(error))

