import {Component, Element, Prop, State, Watch} from '@stencil/core';
import {AV_API_KEY} from "../../global/api";

@Component({
  tag: 'uc-stock-price',
  styleUrl: './stock-price.css',
  shadow: true
})
export class StockPrice {

  submitButton: HTMLButtonElement;
  stockInput: HTMLInputElement;
  stockUserInputValid = false;

  @Element() el: HTMLElement;
  @State() fetchedPrice: number;
  @State() stockUserInput: string;
  @State() error: string;

  @Prop({mutable: true, reflectToAttr: true}) stockSymbol: string;

  @Watch('stockSymbol')
  stockSymbolChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.fetchStockSymbol(newValue);
    }
  }

  onFetchStockPrice(event: Event) {
    event.preventDefault();
    this.submitButton.disabled = true;

    // three ways of accessing the value
    const input = this.el.shadowRoot.querySelector('#stock-symbol') as HTMLInputElement;
    console.log(input.value, this.stockInput.value, this.stockUserInput);

    this.fetchStockSymbol(input.value);
  }

  fetchStockSymbol(stockSymbol: string) {
    this.stockUserInput = stockSymbol;

    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`)
      .then(res => res.json())
      .then(res => {
        if (!res['Global Quote'] || !res['Global Quote']['05. price']) {
          throw new Error('Invalid stock ticker!');
        }

        this.fetchedPrice = +res['Global Quote']['05. price'];
        this.submitButton.disabled = false;
      })
      .catch(err => {
        this.error = err.message;
        console.log(this.error);
      })
  }

  render() {
    console.log('render()');

    let dataContent = <p>Please enter a symbol!</p>;

    if (this.error) {
      dataContent = <p>{this.error}</p>;
    }

    if (this.fetchedPrice) {
      dataContent = <p>Price: ${this.fetchedPrice}</p>;
    }

    return [
      <form onSubmit={this.onFetchStockPrice.bind(this)}>
        <input id="stock-symbol"
               value={this.stockUserInput}
               onInput={this.onUserInput.bind(this)}
               ref={el => this.stockInput = el}/>
        <button type="submit"
                disabled={!this.stockUserInputValid}
                ref={el => this.submitButton = el}>
          Fetch
        </button>
      </form>,
      <div>
        {dataContent}
      </div>
    ]
  }

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

  onUserInput(event: Event) {
    console.log('onUserInput()');

    this.stockUserInput = (event.target as HTMLInputElement).value;
    this.stockUserInputValid = this.stockUserInput.trim().length > 0;
    this.submitButton.disabled = false;
    this.fetchedPrice = null;
    this.error = null;

    console.log(this.stockUserInput);
  }
}
