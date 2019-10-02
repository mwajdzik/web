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
                    background-color: beige;
                    color: black;
                    position: absolute;
                    z-index: 10;
                    border: darkgray solid 1px;
                    border-radius: 4px;
                    padding: 0.5em;
                }
                               
                .icon {
                    background-color: darkcyan;
                    color: white;
                    padding: 0.15em 0.5em;
                    border-radius: 50%;
                    cursor: default;
                }
                
                /* style what is put in the slot */
                ::slotted(b) {
                    text-decoration: underline;
                }
                
                /* the default style of the component */
                :host {
                    background-color: azure;
                }
                
                /* the default style of the component with .important class */
                :host(.important) {
                    background-color: orange;
                }
                
                :host-context(div.some-class) {
                    background-color: #ffffdb;
                }
            </style>
            
            <slot>Some default</slot>
            <span class="icon">?</span>
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