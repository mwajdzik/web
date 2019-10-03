import {Component, Prop} from '@stencil/core';

@Component({
  tag: 'uc-side-drawer',
  styleUrl: './side-drawer.css',
  shadow: true
})
export class SideDrawer {
  @Prop({reflectToAttr: true}) title: string;
  @Prop({reflectToAttr: true, mutable: true}) open = false;

  render() {
    console.log('Rendering... value: ' + this.title + ', open: ' + this.open);

    if (this.open) {
      return (
        <aside>
          <header>
            <h1>{this.title}</h1>
            <button onClick={this.onCloseDrawer.bind(this)}>X</button>
          </header>
          <main>
            <slot/>
          </main>
        </aside>
      );
    }
  }

  onCloseDrawer() {
    console.log('Closing the side drawer...');
    this.open = false;
  }
}
