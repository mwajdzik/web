import {Component, Element, h, Listen, Prop, State, Watch} from '@stencil/core';
import {AV_API_KEY} from "../../global/api";

@Component({
  tag: 'uc-stock-price',
  styleUrl: './stock-price.css',
  shadow: true
})
export class StockPrice {

  private stockInput: HTMLInputElement;
  private stockSymbolEl: HTMLInputElement;

  @Element() private el: HTMLElement;

  @State() private fetchedPrice: number;
  @State() private stockUserInput: string;
  @State() private error: string;
  @State() private loading = false;

  // ------------------------------------------------------------------------------------

  @Prop({mutable: true, reflect: true})
  public stockSymbol: string;

  @Watch('stockSymbol')
  stockSymbolChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      console.log('@Watch: setting a new value: ' + newValue);
      this.fetchStockSymbol(newValue);
    }
  }

  // ------------------------------------------------------------------------------------

  @Listen('ucSymbolSelected', {target: 'body'})
  onStockSymbolSelected(event: CustomEvent) {
    if (event.detail && event.detail !== this.stockSymbol) {
      this.fetchStockSymbol(event.detail);
    }
  }

  // ------------------------------------------------------------------------------------

  private fetchStockSymbol(stockSymbol: string) {
    this.loading = true;
    this.error = undefined;
    this.stockSymbol = stockSymbol;
    this.stockUserInput = stockSymbol;

    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`)
      .then(res => res.json())
      .then(res => {
        if (!res['Global Quote'] || !res['Global Quote']['05. price']) {
          throw new Error('Invalid stock ticker!');
        }

        this.fetchedPrice = +res['Global Quote']['05. price'];
        this.loading = false;
      })
      .catch(err => {
        console.log('ERROR:', err);
        this.error = err.message;
        this.fetchedPrice = null;
        this.loading = false;
      })
  }

  onUserInput(event: Event) {
    console.log('onUserInput()');

    this.stockUserInput = (event.target as HTMLInputElement).value;
    this.fetchedPrice = null;
    this.error = null;

    console.log(this.stockUserInput);
  }

  // ------------------------------------------------------------------------------------

  render() {
    console.log('render()');

    let dataContent;

    if (this.error) {
      dataContent = <p>{this.error}</p>;
    } else if (this.loading) {
      dataContent = <p>Loading...</p>;
    } else if (this.fetchedPrice) {
      dataContent = <p>Price: ${this.fetchedPrice}</p>;
    } else {
      dataContent = <p>Please enter a symbol!</p>
    }

    return [
      <form onSubmit={this.onFetchStockPrice.bind(this)}>
        <input id="stock-symbol"
               value={this.stockUserInput}
               onInput={this.onUserInput.bind(this)}
               ref={el => this.stockInput = el}/>
        <button type="submit"
                disabled={this.stockSymbol.trim().length == 0 || this.loading}>
          Fetch
        </button>
      </form>,
      <div>
        {dataContent}
      </div>
    ]
  }

  // executed after render()
  hostData() {
    console.log('hostData()');

    this.stockSymbolEl = this.el.shadowRoot.querySelector('#stock-symbol') as HTMLInputElement

    return {
      class: this.error ? 'error hydrated' : 'hydrated'
    }
  }

  onFetchStockPrice(event: Event) {
    event.preventDefault();

    console.log('Three ways of accessing the value from the input:',
      this.stockUserInput, this.stockInput.value, this.stockSymbolEl.value);

    this.fetchStockSymbol(this.stockUserInput);
  }

  // ------------------------------------------------------------------------------------
  // Lifecycle hooks:
  // ------------------------------------------------------------------------------------

  componentWillLoad() {
    console.log('Component will load!');
    this.stockUserInput = this.stockSymbol;
  }

  componentDidLoad() {
    console.log('Component did load!');

    if (this.stockSymbol) {
      this.fetchStockSymbol(this.stockSymbol);
    }
  }

  componentWillUpdate() {
    console.log('Component will update!');
  }

  componentDidUpdate() {
    console.log('Component did update!');
  }

  componentDidUnload() {
    console.log('Component did unload!');
  }
}
