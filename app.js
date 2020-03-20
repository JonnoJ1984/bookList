//ES5 OOP Programming constructors

// Book Constructor

function Book(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

//UI Constructor - set of protoype methods
function UI(){
}

//add a book to list
UI.prototype.addBookToList = function(book){
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

//show alert
UI.prototype.showAlert = function(msg, className){
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

//delete book by clicking the X
UI.prototype.deleteBook = function(target){
    if(target.className === 'delete'){
        target.parentElement.parentElement.remove();
    }
}

//Clear Fields
UI.prototype.clearFields = function(){
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
}

//Event listeners

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

    //show  alert
    ui.showAlert('Book has been removed from list.', 'success');

    event.preventDefault();
});
