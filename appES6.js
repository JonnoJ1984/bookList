class Book {

    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI{
    //Add a book to the list 
    addBookToList(book){
        const list = document.getElementById('book-list');
        //create tr element 
        const row = document.createElement('tr');
        //insert calls
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href = "#" class = "delete">X</a></td>
        `;
        list.appendChild(row);
    }

    //shows alert for success or error owing to class - either success or error
    showAlert(msg, className){
        //create div
        const div = document.createElement('div');
        //add classes
        div.className = `alert ${className}`;
        //add text
        div.appendChild(document.createTextNode(msg));
        //get parent element 
        const container = document.querySelector('.container');
        //get form
        const form  = document.querySelector('#book-form');
        //insert alert
        container.insertBefore(div, form);

        //alert to disappear after 3 seconds -> timeout
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);
    }

    //Removes book from list when the 'x' is cliecked
    deleteBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }

    //after successful submission, fields are cleared
    clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}


//local storage clas
class Store{

    //fetch from local storage
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    //displays books in the UI
    static displayBooks(){
        const books = Store.getBooks();

        books.forEach(function(book){
            const ui = new UI();
            //add book to UI
            ui.addBookToList(book);
        });
    }

    //save an entry to local storage
    static addBookToStorage(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    //remove an entry from local storage
    static removeBookFromStorage(isbn){
        //fetch from local storage
        const books = Store.getBooks();
        //if entry's isbn is equal to the isbn entered as the parameter, then remove
        books.forEach(function(book, index){
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        //push array of objects back onto local storage, minus the entry you just removed
        localStorage.setItem('books', JSON.stringify(books));

    }
}

//Event listeners

//DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

//event listener for adding a book 
document.getElementById('book-form').addEventListener('submit', function(event){

    //Get form values
    const   title = document.getElementById('title').value,
            author = document.getElementById('author').value,
            isbn = document.getElementById('isbn').value
    //console.log(title, author, isbn);

    //instantiate book as per object
    const book = new Book(title, author, isbn);

    //instantiate UI
    const ui = new UI();

    //validate
    if(title === '' || author === '' || isbn === ''){
        //error alert
        ui.showAlert('Please fill in all the fields correctly.', 'error');
    }else{
        //add book to list
        ui.addBookToList(book);
        //add book to local storage
        Store.addBookToStorage(book);

        //show success!
        ui.showAlert('Booked added successfully!', 'success');

        //clear fields
        ui.clearFields();
    }
    
    event.preventDefault();
});

//event listener for delete -> must use event delegation becuase element is added dynamically after inital load
document.getElementById('book-list').addEventListener('click', function(event){
    
    //instantiate UI
    const ui = new UI();

    //delete book
    ui.deleteBook(event.target);
    //Remove from local storage
    Store.removeBookFromStorage(event.target.parentElement.previousElementSibling.textContent);

    //show  alert
    ui.showAlert('Book has been removed from list.', 'removed');

    event.preventDefault();
});