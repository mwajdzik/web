import {Component, Prop} from '@stencil/core';

@Component({
  tag: 'uc-side-drawer',
  styleUrl: './side-drawer.css',
  shadow: true
})
export class SideDrawer {
  @Prop({reflectToAttr: true}) title: string;

  render() {
    return (
      <aside>
        <header><h1>{this.title}</h1></header>
        <main>
          <slot/>
        </main>
      </aside>
    );
  }
}
