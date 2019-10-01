//

class Tooltip extends HTMLElement {

    constructor() {
        super();
        console.log('1. Element created - basic initializations');

        this._tooltipContainer = null;
        this._tooltipText = 'Some dummy tooltip text';

        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
            <style>
                div {
                    background-color: #2f7eb6;
                    color: white;
                    position: absolute;
                    z-index: 10;
                }            
            </style>
            <slot>Some default</slot>
            <span> (?)</span>
        `
    }

    connectedCallback() {
        console.log('2. Element attached to DOM - DOM initializations');

        if (this.hasAttribute('text')) {
            this._tooltipText = this.getAttribute('text');
        }

        const tooltipIcon = this.shadowRoot.querySelector('span');
        tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this));
        tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this));
    }

    _showTooltip() {
        this._tooltipContainer = document.createElement('div');
        this._tooltipContainer.textContent = this._tooltipText;
        this.shadowRoot.appendChild(this._tooltipContainer);
        this.style.position = 'relative';
    }

    _hideTooltip() {
        this.shadowRoot.removeChild(this._tooltipContainer);
        this._tooltipContainer = undefined;
    }

    attributeChangedCallback() {
        console.log('3. Observed attribute updated');
    }

    disconnectedCallback() {
        console.log('n. Element detached from DOM - clean up work');
    }
}

customElements.define('uc-tooltip', Tooltip);