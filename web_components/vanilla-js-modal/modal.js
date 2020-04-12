class Modal extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        this.shadowRoot.innerHTML = `
            <style>
                #backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.75);
                    z-index: 10;
                    opacity: 0;
                    pointer-events: none;
                }
                
                :host([opened]) #backdrop,
                :host([opened]) #modal {
                    opacity: 1;
                    pointer-events: all;
                }
                
                :host([opened]) #modal {
                    top: 15vh;
                }

                #modal {
                    position: fixed;
                    top: 10vh;
                    left: 25%;
                    width: 50%;
                    background: white;
                    border-radius: 3px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    z-index: 100;
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.2s ease-in;
                }
                
                header {
                    padding: 1rem;
                    border-bottom: 1px solid #ccc;
                }
                
                ::slotted(h1) {
                    font-size: 1.25rem;
                    margin: 0;
                }
                
                #main {
                    padding: 1rem;
                }
                
                #actions {
                    border-top: 1px solid #ccc; 
                    padding: 1rem;
                    display: flex;
                    justify-content: flex-end;      
                }
                
                #actions button {
                    margin: 0 0.25rem;      
                }
            </style>
            
            <div id="backdrop"></div>
            
            <div id="modal">
                <header>
                    <slot name="title"></slot>
                </header>
                <section id="main">
                    <slot name="main"></slot>
                </section>
                <section id="actions">
                    <button id="cancel-btn">Cancel</button>
                    <button id="confirm-btn">OK</button>
                </section>
            </div>
        `;

        const slots = this.shadowRoot.querySelectorAll('slot');
        slots[1].addEventListener('slotchange', (event) => {
            console.log('New content arrived to the slot');
            console.dir(slots[1].assignedNodes())
        });

        const cancelButton = this.shadowRoot.querySelector('#cancel-btn');
        const confirmButton = this.shadowRoot.querySelector('#confirm-btn');

        cancelButton.addEventListener('click', this._cancel.bind(this));
        confirmButton.addEventListener('click', this._confirm.bind(this));

        const backdrop = this.shadowRoot.querySelector('#backdrop');
        backdrop.addEventListener('click', this._cancel.bind(this));
    }

    attributeChangedCallback() {
        if (name === 'opened') {
            console.log('opened attribute changed');
        }
    }

    static get observedAttributes() {
        return ['opened'];
    }

    open() {
        this.opened = true;
        this.setAttribute('opened', '');
    }

    hide() {
        this.opened = false;
        if (this.hasAttribute('opened')) {
            this.removeAttribute('opened');
        }
    }

    _cancel(event) {
        this.hide();

        // composed - event can leave the shadow DOM
        const cancelEvent = new Event('cancel', {bubbles: true, composed: true});
        event.target.dispatchEvent(cancelEvent);

        // or:
        this.dispatchEvent(new Event('cancel'));                                // only modal will catch it
        this.dispatchEvent(new Event('cancel', {bubbles: true}));               // modal and body will catch it
    }

    _confirm(event) {
        this.hide();

        const confirmEvent = new Event('confirm', {bubbles: true, composed: true});
        event.target.dispatchEvent(confirmEvent);
    }
}

customElements.define('uc-modal', Modal);
