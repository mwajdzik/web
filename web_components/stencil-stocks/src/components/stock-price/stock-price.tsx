import {Component, Element, h, Listen, Prop, State, Watch} from '@stencil/core';
import {AV_API_KEY} from "../../global/api";

@Component({
  tag: 'uc-stock-price',
  styleUrl: './stock-price.css',
  shadow: true
})
export class StockPrice {

  submitButton: HTMLButtonElement;
  stockInput: HTMLInputElement;

  @Element() el: HTMLElement;

  @State() fetchedPrice: number;
  @State() stockUserInput: string;
  @State() error: string;
  @State() loading = false;

  // ------------------------------------------------------------------------------------
  // @Watch for stockSymbol
  // ------------------------------------------------------------------------------------

  @Prop({mutable: true, reflectToAttr: true}) stockSymbol: string;

  @Watch('stockSymbol')
  stockSymbolChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      console.log('@Watch: setting a new value: ' + newValue);
      this.fetchStockSymbol(newValue);
    }
  }

  // ------------------------------------------------------------------------------------

  onFetchStockPrice(event: Event) {
    event.preventDefault();

    const inputValue1 = this.stockUserInput;
    const inputValue2 = this.stockInput.value;
    const inputValue3 = (this.el.shadowRoot.querySelector('#stock-symbol') as HTMLInputElement).value;
    console.log('Three ways of accessing the value from the input:', inputValue1, inputValue2, inputValue3);

    this.fetchStockSymbol(inputValue1);
  }

  // ------------------------------------------------------------------------------------
  // @Listen for ucSymbolSelected
  // ------------------------------------------------------------------------------------

  @Listen('ucSymbolSelected', {target: 'body'})
  onStockSymbolSelected(event: CustomEvent) {
    if (event.detail && event.detail !== this.stockSymbol) {
      this.fetchStockSymbol(event.detail);
    }
  }

  // ------------------------------------------------------------------------------------

  fetchStockSymbol(stockSymbol: string) {
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
  // hostData - executed after render()
  // ------------------------------------------------------------------------------------

  hostData() {
    console.log('hostData()');

    return {
      class: this.error ? 'error hydrated' : 'hydrated'
    }
  }

  // ------------------------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------------------------

  render() {
    console.log('render()');

    let dataContent;
    const stockUserInputValid = this.stockSymbol.trim().length > 0;

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
                disabled={!stockUserInputValid || this.loading}
                ref={el => this.submitButton = el}>
          Fetch
        </button>
      </form>,
      <div>
        {dataContent}
      </div>
    ]
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
