export interface Item {
  name: string;
  quantity: number;
  pricePerUnit: number;
  totalItemPrice: number;
}

export interface Receipt {
  items: [Item];
  subtotal: number;
  tip: number;
  serviceFee: number;
  tax: number;
  totalPrice: number;
}