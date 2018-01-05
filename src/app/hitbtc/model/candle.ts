export class Candle {

  constructor(candle: Candle) {
    this.open = candle.open;
    this.close = candle.close;
    this.min = candle.min;
    this.max = candle.max;
    this.timestamp = new Date(candle.timestamp);
  }

  timestamp: Date;
  open: string;
  close: string;
  min: string;
  max: string;
  volume: string;
  volumeQuote: string
}
