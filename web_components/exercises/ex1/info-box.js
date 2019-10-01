//

class InfoBox extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = this.getInnerHtml();
        this._button = this.shadowRoot.querySelector('button');
        this._infoBox = this.shadowRoot.querySelector('#info-box');
        this._isHidden = true;
    }

    getInnerHtml() {
        return `
            <button>Show</button>
            <p id="info-box" style="display: none;">
                <slot></slot>
            </p>
        `
    }

    connectedCallback() {
        if (this.hasAttribute('is-visible')) {
            if (this.getAttribute('is-visible') === 'true') {
                this.toggleVisibility();
            }
        }

        this._button.addEventListener('click', this.toggleVisibility.bind(this));
    }

    toggleVisibility() {
        if (this._isHidden) {
            this._infoBox.style.display = 'block';
            this._button.textContent = 'Hide';
            this._isHidden = false;
        } else {
            this._infoBox.style.display = 'none';
            this._button.textContent = 'Show';
            this._isHidden = true;
        }
    }
}

customElements.define('uc-info-box', InfoBox);