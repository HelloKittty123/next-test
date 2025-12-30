export interface ICustomerLoginAuthorizationCodeAttr {
  authorizationUrl?: string;
  prompt?: string;
  tokenUrl?: string;
  verifyUrl?: string;
  scope?: string;
  clientId?: string;
  redirectUri?: string;
}

export interface ILoginTypePerson {
  active: boolean;
  attribute?: any;
  createdBy: string;
  createdDate: string;
  custId: string | number;
  email?: string;
  id: number;
  lastModifiedBy: string;
  lastModifiedDate: string;
  name: string;
  orgIn: string;
  type: string;
  userId?: number;
}
