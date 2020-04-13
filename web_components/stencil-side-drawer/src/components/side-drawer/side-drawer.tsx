import {Component, h, Method, Prop, State} from '@stencil/core';

@Component({
  tag: 'uc-side-drawer',
  styleUrl: './side-drawer.css',
  shadow: true
})
export class SideDrawer {

  // @Prop properties are set from the outside
  // reflect means keeping prop values in sync with their respective attributes
  @Prop({reflect: true}) sideDrawerTitle: string;
  @Prop({reflect: true, mutable: true}) opened = false;         // mutable - watched by Stencil for internal changes

  // @State properties hold the internal state
  @State() showContactInfo = false;                             // watched by Stencil for internal changes (will rerun render)

  render() {
    console.log('Rendering... value: ' + this.sideDrawerTitle + ', open: ' + this.opened);

    let mainContent = <slot/>;

    if (this.showContactInfo) {
      mainContent = (
        <div id="contact-information">
          <h2>Contact Information</h2>
          <p>You can reach us via phone or email.</p>
          <ul>
            <li>Phone: 458484848448</li>
            <li>E-Mail: <a href="mailto:someone@somewhere.com">someone@somewhere.com</a></li>
          </ul>
        </div>
      )
    }

    if (this.opened) {
      return [
        <div class="backdrop"
             onClick={this.onCloseDrawer.bind(this)}/>,

        <aside>
          <header>
            <h1>{this.sideDrawerTitle}</h1>
            <button onClick={this.onCloseDrawer.bind(this)}>X</button>
          </header>

          <section id="tabs">
            <button
              class={!this.showContactInfo ? 'active' : ''}
              onClick={this.onContentChange.bind(this, 'nav')}>Navigation
            </button>
            <button
              class={this.showContactInfo ? 'active' : ''}
              onClick={this.onContentChange.bind(this, 'contact')}>Contact
            </button>
          </section>

          <main>
            {mainContent}
          </main>
        </aside>
      ];
    }
  }

  onCloseDrawer() {
    this.opened = false;
  }

  onContentChange(content: string) {
    this.showContactInfo = (content === 'contact');
  }

  @Method()
  async isOpened() {
    return this.opened;
  }

  @Method()
  async openDrawer() {
    this.opened = true;
  }
}
