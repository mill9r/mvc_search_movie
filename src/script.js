const BASE_URL = 'http://reactjs-cdp.herokuapp.com/'
const PATH = 'movies'

class Model {
    constructor(api, path) {
        this.api = api
        this.path = path
    }

    getMovies(search) {
        this.api.sendGetRequest(`${this.path}?search=${search}&searchBy=title`)
            .then(response => response.json())
            .then(data => {
                this.onSearchMovieChanged(Utils.extractDataFields(data.data,'title'))
            })
    }

    bindMoviesSearchUpdate(callback){
        this.onSearchMovieChanged = callback
    }
}

class View {
    constructor() {
        this.app = this.getElement('#root');
        this.form = this.createElement('form');
        this.input = this.createElement('input');
        this.movies = this.createElement('ul')
        this.submitButton = this.createElement('button', '', 'Search')
        this.input.type = 'text';
        this.input.placeholder = 'Enter search criteria';
        this.input.name = 'search';
        this.form.append(this.input, this.submitButton);
        this.app.append(this.form, this.movies);
        this.render();
    }

    render(movies = []) {
        while (this.movies.firstChild) {
            this.movies.removeChild(this.movies.firstChild)
        }

        if (movies.length === 0) {
            const stub = this.createElement('p');
            stub.textContent = 'Nothing to show'
            this.movies.append(stub)
        } else {
            movies.forEach(movie => {
                const li = this.createElement('li');
                const p = this.createElement('p', '', movie);
                li.append(p)
                this.movies.append(li)
            })

        }
    }

    getSearchText() {
        return this.input.value;
    }

    resetInput() {
        this.input.value = '';
    }

    bindSearch(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault();

            if (this.getSearchText()) {
                handler(this.getSearchText());
                this.resetInput();
            }
        })
    }

    createElement(tag, className, textContent) {
        const el = document.createElement(tag);
        if (className) {
            el.classList.add(className);
        }
        if (textContent) {
            el.textContent = textContent;
        }
        return el;
    }

    getElement(selector) {
        const el = document.querySelector(selector);
        return el;
    }
}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindSearch(this.handleSearchTitle)
        this.model.bindMoviesSearchUpdate(this.onMoviesChanged)
    }

    onMoviesChanged = movies => {
        this.view.render(movies);
    }

    handleSearchTitle = title => {
        this.model.getMovies(title)
    }

}

class Api {
    constructor(baseUrl) {
        this.baseUrl = baseUrl
    }

    sendGetRequest(path) {
        return fetch(this.baseUrl + path);
    }

}

class Utils {
    static extractDataFields(list,field){
        return list.reduce((acc,item)=>{
            acc.push(item[field])
            return acc;
        },[])
    }

}


const app = new Controller(new Model(new Api(BASE_URL), PATH), new View())
