const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const genreInput = document.getElementById('genre');
const yearInput = document.getElementById('year');

const bookContainer = document.getElementById("book-container");
const searchInput = document.getElementById("search");

let books;

try {
    const storedBooks = localStorage.getItem('books');
    books = storedBooks ? JSON.parse(storedBooks) : [];
} catch (error) {
    console.error("Erro ao carregar livros do localStorage:", error);
    books = [];
}

document.getElementById('addBookButton').addEventListener('click', addBook);
document.getElementById('searchButton').addEventListener('click', searchBook);

function addBook() {
    if (titleInput.value === '' || authorInput.value === '' || genreInput.value === '' || yearInput.value === '') {
        alert("Por Favor, preencha os campos vazios!");
    } else {
        const book = {
            title: titleInput.value,
            author: authorInput.value,
            genre: genreInput.value,
            year: yearInput.value,
            ratings: []
        };

        books.push(book);
        update(books);
        saveData();

        titleInput.value = '';
        authorInput.value = '';
        genreInput.value = '';
        yearInput.value = '';
    }
}

function update(bookList) {
    bookContainer.innerHTML = '';

    bookList.forEach(book => {
        const li = document.createElement('li');
        li.innerHTML = `
            Título: ${book.title}, Autor: ${book.author}, Gênero: ${book.genre}, Ano: ${book.year} ---
            <span class="rating">Avaliação Média: ${calculateRating(book.ratings)}</span>`;

        const ratingBtn = document.createElement("button");
        ratingBtn.innerHTML = "Avaliar";
        ratingBtn.addEventListener("click", () => addRating(book, li));

        const span = document.createElement("span");
        span.innerHTML = '\u00d7';
        span.addEventListener("click", () => {
            const index = books.indexOf(book);
            if (index > -1) {
                books.splice(index, 1); 
                update(books); 
                saveData();
            }
        });

        li.appendChild(ratingBtn);
        li.appendChild(span);
        bookContainer.appendChild(li);
    });
}

function addRating(book, li) {
    const rate = prompt('Avalie esse livro de 1 a 5:');
    const rateNumber = parseInt(rate);

    if (rateNumber >= 1 && rateNumber <= 5) {
        book.ratings.push(rateNumber);
        const avgRating = calculateRating(book.ratings);
        li.querySelector('.rating').innerText = `Avaliação Média: ${avgRating}`;
        saveData();
    } else {
        alert("Por Favor, selecione apenas números entre 1 e 5!");
    }
}

function calculateRating(ratings) {
    if (ratings.length === 0) return "Sem avaliações";
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return (sum / ratings.length).toFixed(1);
}

function searchBook() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.genre.toLowerCase().includes(searchTerm) ||
        book.year.toString().includes(searchTerm)
    );

    update(filteredBooks);
}

function saveData() {
    localStorage.setItem('books', JSON.stringify(books));
}

function showBooks() {
    update(books);
}

showBooks();





