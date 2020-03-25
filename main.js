'use strict'

function Book(title, author, pages, status) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
}
function changeStatus (book, newStatus) {
    book.status = newStatus;
}

let myLibrary = [];
if(!localStorage.getItem('myLibrary')) {
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
  }
myLibrary = JSON.parse(localStorage.getItem('myLibrary'));

function addToLibrary() {
    myLibrary.push(new Book(
        document.querySelector('#title').value,
        document.querySelector('#author').value,
        document.querySelector('#pages').value,
        document.querySelector('option:checked').value
        )
    )
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

function render(book) {
    document.querySelector('main').appendChild(document.createElement('div'));
    document.querySelector('div:last-child').setAttribute('data', myLibrary.indexOf(book));

    for (let property in book) {
        if (book.hasOwnProperty(property) && property != 'status') {
            document.querySelector('div:last-child').appendChild(document.createElement('span'));
            document.querySelector('div:last-child span:last-child').textContent = book[property];
        }
    }

    document.querySelector('div:last-child').appendChild(document.createElement('select'));
    for (let option of ['Reading', 'Completed', 'On-Hold', 'Dropped', 'Plan to Read']) {
        document.querySelector('div:last-child select').appendChild(document.createElement('option'));
        document.querySelector('div:last-child select option:last-child').textContent = option;
        document.querySelector('div:last-child select option:last-child').value = option;
    }
    document.querySelector('select:last-child').addEventListener('change', function(e) {
        changeStatus(myLibrary[e.target.parentNode.getAttribute('data')], this.options[this.selectedIndex].value);
        localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
    })
    document.querySelector(`div:last-child select option[value="${book.status}"]`).selected = true;

    document.querySelector('div:last-child').appendChild(document.createElement('i'));
    document.querySelector('div:last-child i').classList.toggle('remove');

    document.querySelector('div:last-child .remove:last-child').addEventListener('click', event => {
        myLibrary.splice(event.target.parentNode.getAttribute('data'), 1);
        localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
        document.querySelector('main').removeChild(document.querySelector(`div[data="${event.target.parentNode.getAttribute('data')}"]`));
    })
}

for (let book of myLibrary) {
    render(book);
}

function newBook() {
    addToLibrary();
    render(myLibrary[myLibrary.length - 1]);
}

document.querySelector('#new').addEventListener('click', () => document.querySelector('form').style.display = 'flex');
document.querySelector('input[type="reset"').addEventListener('click', () => document.querySelector('form').style.display = 'none');
document.querySelector('form').addEventListener('submit', newBook);