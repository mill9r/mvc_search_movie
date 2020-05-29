const BASE_URL = 'http://reactjs-cdp.herokuapp.com/'
const PATH = 'movies'

class Model {
    constructor(api, path) {
        this.api = api
        this.path = path
    }

    getMovies(search,searchType) {
        this.api.sendGetRequest(`${this.path}?search=${search}&searchBy=${searchType}`)
            .then(data => {
                this.onSearchMovieChanged(Utils.extractDataFields(data.data, 'title'))
            })
    }

    bindMoviesSearchUpdate(callback) {
        this.onSearchMovieChanged = callback
    }
}

class View {
    constructor(form, movies) {
        this.app = this.getElement('#root');
        this.form = form
        this.movies = movies
        this.app.append(this.form.getHtml());
        this.render();
    }

    render(movies = []) {
        console.log(this.movies.getElement().firstChild)
        while (this.movies.getElement().firstChild) {
            this.movies.getElement().removeChild(this.movies.getElement().firstChild);
            this.movies.remove(this.movies.getElement().id);
        }

        if (movies.length === 0) {
            this.movies.add(new Paragraph('p-stub', 'Nothing to show'));
            this.app.append(this.movies.getHtml());
        } else {
            movies.forEach((movie, index) => {
                this.movies.add(new ListItem(`title-${index}`, movie));
            })
            this.app.append(this.movies.getHtml());
        }
    }

    getSearchText() {
        return this.form.getChild('search-field').getValue();
    }

    getDropDownOption(){
        return this.form.getChild('select-search-type').getValue();
    }

    resetInput() {
        this.form.getChild('search-field').setValue('')
    }

    bindSearch(handler) {
        this.form.getHtml().addEventListener('submit', event => {
            event.preventDefault();

            if (this.getSearchText() && this.getDropDownOption()) {
                handler(this.getSearchText(),this.getDropDownOption());
                this.resetInput();
            }
        })
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

        this.view.bindSearch(this.handleSearch);
        this.model.bindMoviesSearchUpdate(this.onMoviesChanged);
    }

    onMoviesChanged = movies => {
        this.view.render(movies);
    }

    handleSearch = (input,searchType) => {
        this.model.getMovies(input,searchType)
    }

}

class Api {
    constructor(baseUrl) {
        this.baseUrl = baseUrl
    }

    sendGetRequest(path) {
        return fetch(this.baseUrl + path).then(response => response.json());
    }

}

class Utils {
    static extractDataFields(list, field) {
        return list.reduce((acc, item) => {
            acc.push(item[field])
            return acc;
        }, [])
    }

}


const form = new CompositeForm('search-form', 'GET');
form.add(new InputField('search-field', '', 'Enter search'));
form.add(new SelectField('select-search-type','','',
    '',[{abbr:'title',value:'title'},{abbr:'genres',value:'genres'}]))
form.add(new SubmitButton('search-button', 'Search', '', 'submit'));

const movies = new List('movies', 'ul');
const app = new Controller(new Model(new Api(BASE_URL), PATH), new View(form, movies))
