class ElementHelper {
  htmlElement;

  constructor(tagName) {
    this.htmlElement = document.createElement(tagName);
  }

  setClass(className) {
    this.htmlElement.className = className;
    return this;
  }

  setId(id) {
    this.htmlElement.id = id;
    return this;
  }

  setOnClick(onClick) {
    this.htmlElement.onclick = event => {
      onClick(event, this);
    };
    return this;
  }

  setText(textContent) {
    this.htmlElement.textContent = textContent;
    return this;
  }

  setParent(parent) {
    parent.htmlElement.appendChild(this.htmlElement);
    return this;
  }

  setAttr(attr, val) {
    this.htmlElement.setAttribute(attr, val);
    return this;
  }

  do(action) {
    action(this.htmlElement);
    return this;
  }

  static create(tagName) {
    return new ElementHelper(tagName);
  }
}

export default ElementHelper;
