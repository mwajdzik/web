class Tooltip extends HTMLElement {

    constructor() {
        super();
        console.log('1. Element created - basic initializations');

        this._tooltipIcon = null;
        this._tooltipContainer = null;
        this._tooltipVisible = false;
        this._tooltipText = 'Some dummy tooltip text';

        this.attachShadow({mode: "open"});

        this.shadowRoot.innerHTML = `
            <style>
                div {
                    background-color: beige;
                    color: var(--color-primary, black);
                    position: absolute;
                    top: 2.5rem;
                    left: 10rem;
                    z-index: 10;
                    border: darkgray solid 1px;
                    border-radius: 4px;
                    padding: 0.5em;
                    box-shadow: 1px 1px 6px rgba(0,0,0,0.25);
                }

                .icon {
                    background-color: darkcyan;
                    color: white;
                    padding: 0.15em 0.5em;
                    border-radius: 50%;
                    cursor: default;
                }
                
                /* style what is put in the slot - only top level is allowed */
                ::slotted(b) {
                    text-decoration: underline;
                }
                
                /* the default style of the component - styling uc-tooltip */
                :host {
                    position: relative;
                    background-color: azure;
                }
                
                /* the default style of the component with .important class */
                :host(.important) {
                    background-color: orange;
                }
                
                /* allows to specify surrounding conditions - eg. the component placed in a div with a class */
                :host-context(div.some-class) {
                    background-color: #ffffdb;
                }
            </style>
            
            <slot>Some default</slot>
            <span class="icon">?</span>
        `
    }

    _render() {
        console.log('3. Rendering...');

        if (this._tooltipVisible) {
            this._tooltipContainer = document.createElement('div');
            this._tooltipContainer.textContent = this._tooltipText;
            this.shadowRoot.appendChild(this._tooltipContainer);
        } else {
            if (this._tooltipContainer) {
                this.shadowRoot.removeChild(this._tooltipContainer);
            }
        }
    }

    connectedCallback() {
        console.log('2. Element attached to DOM - DOM initializations');

        if (this.hasAttribute('text')) {
            this._tooltipText = this.getAttribute('text');
        }

        this._tooltipIcon = this.shadowRoot.querySelector('span');
        this._tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this));
        this._tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this));
    }

    _showTooltip() {
        this._tooltipVisible = true;
        this._render();
    }

    _hideTooltip() {
        this._tooltipVisible = false;
        this._render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('4. Observed attribute updated', name, oldValue, newValue);

        if (oldValue !== newValue && name === 'text') {
            this._tooltipText = newValue;
        }
    }

    disconnectedCallback() {
        console.log('5. Element detached from DOM - clean up work');
        this._tooltipIcon.removeEventListener('mouseenter', this._showTooltip);
        this._tooltipIcon.removeEventListener('mouseleave', this._hideTooltip);
    }

    static get observedAttributes() {
        return ['text'];
    }
}

customElements.define('uc-tooltip', Tooltip);
