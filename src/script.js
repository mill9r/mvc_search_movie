const BASE_URL = 'http://reactjs-cdp.herokuapp.com/'
const PATH = 'movies'

class Model {
    constructor(api, path) {
        this.api = api
        this.path = path
    }

    getMovies(search) {
        this.api.sendGetRequest(`${this.path}?search=${search}&searchBy=title`)
            .then(data => {
                this.onSearchMovieChanged(Utils.extractDataFields(data.data, 'title'))
            })
    }

    bindMoviesSearchUpdate(callback) {
        this.onSearchMovieChanged = callback
    }
}

class View {
    constructor(form) {
        this.app = this.getElement('#root');
        this.form = form
        // this.form = this.createElement('form');
        // this.input = this.createElement('input');
        this.movies = this.createElement('ul')
        // this.submitButton = this.createElement('button', '', 'Search')
        // this.input.type = 'text';
        // this.input.placeholder = 'Enter search criteria';
        // this.input.name = 'search';
        // this.form.append(this.input, this.submitButton);
        // this.form.add( this.submitButton);
        this.app.append(this.form.getElement(), this.movies);
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
        return this.form.getChild(0).getValue();
    }

    resetInput() {
        this.input.value = '';
    }

    bindSearch(handler) {
        this.form.getElement().addEventListener('submit', event => {
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

        this.view.bindSearch(this.handleSearchTitle);
        this.model.bindMoviesSearchUpdate(this.onMoviesChanged);
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

class Composite {
    add(child) {
    };

    remove(child) {
    };

    getChild(child) {
    };
}

class FormItem extends Composite {
    save() {
    }
}

class CompositeForm extends FormItem {
    constructor(id, method, action) {
        super();
        this.formComponents = [];
        this.element = document.createElement('form');
        this.element.id = id;
        this.element.method = method || 'POST';
        this.element.action = action || '#';
    }

    add(child) {
        this.formComponents.push(child);
        this.element.append(child.getElement());
    }

    remove(child) {
        this.formComponents = this.formComponents.filter(component => component !== child);
    }

    getChild(i) {
        return this.formComponents[i];
    }

    save() {
        this.formComponents.forEach(component => component.save());
    }

    getElement() {
        return this.element;
    }
}

class Field extends FormItem {
    constructor(id) {
        super()
        this.id = id;
        this.element;
    }

    getElement() {
        return this.element;
    }

    getValue() {
        throw new Error('Unsupported operation on the class Field')
    }
}

class InputField extends Field {
    constructor(id,label,placeholder,cssStyle) {
        super(id);
        this.input = document.createElement('input');
        this.input.id = id;
        this.input.placeholder = placeholder;

        this.label = document.createElement('label');
        const labelTextNode = document.createTextNode(label);
        this.label.append(labelTextNode);

        this.element = document.createElement('div');
        this.element.className = cssStyle;
        this.element.append(this.label);
        this.element.append(this.input);
    }

    getValue() {
        return this.input.value;
    }
}
// Stub
class TextArea extends Field{
    constructor() {
        super();
    }
}

class Button extends Composite{
     constructor(name,className='') {
         super();
         this.element = document.createElement('button');
         this.element.innerText = name;
         this.element.className = className;
     }

    getElement() {
        return this.element;
    }
}




const form = new CompositeForm('search-form','GET')
form.add(new InputField('search-field','','Enter search'))
form.add(new Button('Search','',))
const app = new Controller(new Model(new Api(BASE_URL), PATH), new View(form))
