class Composite {
    add(child) {};
    remove(child) {};
    getChild(child) {};
    getHtml(){};
}


class CompositeForm extends Composite {
    constructor(id, method, action) {
        super();
        this.list = [];
        this.element = document.createElement('form');
        this.element.id = id;
        this.element.method = method || 'POST';
        this.element.action = action || '#';
    }

    add(child) {
        this.list.push(child);
    }

    remove(child) {
        this.list = this.list.filter(component => component !== child);
    }

    getChild(id) {
       return this.list.filter(item => item.getHtml().id === id)[0];
    }

    getHtml() {
        let items = this.list.map(item => {
            return item.getHtml();
        })
        this.element.append(...items)
        return this.element;
    }

}

class InputField extends Composite {
    constructor(id, label, placeholder, cssStyle) {
        super()
        this.element = document.createElement('input');
        this.element.id = id;
        this.element.placeholder = placeholder;
        if (cssStyle) this.element.className = cssStyle;
    }

    getHtml() {
        return this.element;
    }

    getValue(){
        return this.element.value
    }

    setValue(value) {
        return this.element.value = value;
    }
}

class  SelectField extends Composite{
    constructor(id, label, placeholder, cssStyle, stateArray=[]) {
        super();
        this.element = document.createElement('select');
        this.element.id = id;
        this.element.placeholder = placeholder;
        if (cssStyle) this.element.className = cssStyle;
        stateArray.forEach(state=>{
            let option = document.createElement('option');
            option.value = state.abbr;
            option.text = state.value;
            this.element.append(option)
        })
    }

    getHtml() {
        return this.element;
    }

    getValue(){
        return this.element.value;
    }
}


class SubmitButton extends Composite {
    constructor(id, value, className = '', type) {
        super();
        this.element = document.createElement("button");
        this.element.innerHTML = value;
        this.element.type = type;
        this.element.id = id;
        if (className) this.element.className = className;
    }

    getHtml() {
        return this.element;
    }
}

class List extends Composite {
    constructor(id, listType, cssStyle) {
        super();
        this.list = [];
        this.element = document.createElement(listType);
        if (cssStyle) this.element.className = cssStyle;
        this.element.id = id;
    }

    add(child) {
        this.list.push(child);
    }

    remove(child) {
        this.list = this.list.filter(item => item.id !== child.id);
    }

    getChild(id) {
        return this.list.filter(item => item.getHtml().id === id)[0];
    }

    getElement() {
        return this.element;
    }

    getHtml() {
        let items = this.list.map(item => {
            return item.getHtml();
        })
        this.element.append(...items)
        return this.element;
    }
}

class ListItem extends Composite {
    constructor(id, innerText, cssStyle) {
        super();
        this.element = document.createElement('li');
        this.element.textContent = innerText;
        this.element.id = id;
        if (cssStyle) this.element.className = cssStyle;
    }

    getHtml(){
        return this.element
    }

}

class Paragraph extends Composite {
    constructor(id,innerText, cssStyle) {
        super();
        this.element = document.createElement('p');
        this.element.id = id;
        this.element.textContent = innerText;
        if (cssStyle) this.element.className = cssStyle;
    }

    getHtml() {
        return this.element;
    }
}
