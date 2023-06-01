export interface PaymentCreate {
  id: string;
  status: string;
  amount: Amount;
  description: string;
  recipient: Recipient;
  created_at: Date;
  confirmation: Confirmation;
  test: boolean;
  paid: boolean;
  refundable: boolean;
  metadata: Metadata;
}

export interface PaymentCheck {
  id: string;
  status: string;
  amount: Amount;
  income_amount: Amount;
  description: string;
  recipient: Recipient;
  payment_method: PaymentMethod;
  captured_at: Date;
  created_at: Date;
  test: boolean;
  refunded_amount: Amount;
  paid: boolean;
  refundable: boolean;
  metadata: Metadata;
}

export interface Amount {
  value: string;
  currency: string;
}

export interface Confirmation {
  type: string;
  confirmation_url: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Metadata {}

export interface Recipient {
  account_id: string;
  gateway_id: string;
}

export interface PaymentMethod {
  type: string;
  id: string;
  saved: boolean;
  title: string;
  account_number: string;
}

export interface Recipient {
  account_id: string;
  gateway_id: string;
}
