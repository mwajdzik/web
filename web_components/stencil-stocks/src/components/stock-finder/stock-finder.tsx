import {Component, Event, EventEmitter, h, State} from '@stencil/core';
import {AV_API_KEY} from "../../global/api";

@Component({
  tag: 'uc-stock-finder',
  styleUrl: './stock-finder.css',
  shadow: true
})
export class StockPrice {

  stockNameInput: HTMLInputElement;

  @State() searchResults: { symbol: string, name: string }[] = [];
  @Event({bubbles: true, composed: true}) ucSymbolSelected: EventEmitter<string>;

  onFindStocks(event: Event) {
    event.preventDefault();

    const stockSymbol = this.stockNameInput.value;
    this.searchResults = [];

    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockSymbol}&apikey=${AV_API_KEY}`)
      .then(res => res.json())
      .then(res => {
        this.searchResults = res['bestMatches'].map(match => {
          return {symbol: match['1. symbol'], name: match['2. name']}
        });
      })
      .catch(err => {
        console.log('ERROR:', err);
      })
  }

  onSymbolSelect(symbol: string) {
    this.ucSymbolSelected.emit(symbol);
  }

  render() {
    return [
      <form onSubmit={this.onFindStocks.bind(this)}>
        <input id="stock-symbol"
               ref={el => this.stockNameInput = el}/>
        <button type="submit">
          Find
        </button>
      </form>,
      <ul>
        {this.searchResults.map(result => (
          <li onClick={this.onSymbolSelect.bind(this, result.symbol)}>
            <strong>{result.symbol}</strong> - {result.name}
          </li>
        ))}
      </ul>
    ]
  }
}
