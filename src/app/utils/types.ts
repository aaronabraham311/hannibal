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

export interface SplitwiseMember {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  registration_status: string;
  picture: {
    small: string;
    medium: string;
    large: string;
  };
  custom_picture: boolean;
  balance: [{
    currency_code: string;
    amount: string;
  }]
}

export interface SplitwiseGroup {
  id: number;
  name: string;
  group_type: string;
  updated_at: string;
  simplify_by_default: boolean;
  members: [SplitwiseMember];
  original_debts: [{
    from: number;
    to: number;
    amount: string;
    currency_code: string;
  }];
  simplified_debts: [{
    from: number;
    to: number;
    amount: string;
    currency_code: string; 
  }];
  avatar: {
    original: string | null;
    xxlarge: string;
    xlarge: string;
    large: string;
    medium: string;
    small: string;
  };
  custom_avatar: boolean;
  cover_photo: {
    xxlarge: string;
    xlarge: string; 
  };
  invite_link: string;
}

export interface SplitwiseGetGroupsResponse {
  groups: [SplitwiseGroup]
}

export interface GetGroupResponse {
  groupId: number;
  groupMembers: [SplitwiseMember];
}

export interface ProposedSplits {
  [item: string]: SplitwiseMember[];
}

export interface FinalReceiptMemberSplit {
  memberInfo: SplitwiseMember;
  splits: {
    [itemName: string] : number;
  };
  subtotal: number;
  tip: number;
  serviceFee: number;
  tax: number;
}

export interface FinalReceiptSplit {
  members: FinalReceiptMemberSplit[];
  total: number;
}