import Resource from '../../resource';
import Configuration from '../../configuration';

export interface ICreditReportTradelinePaymentHistoryItem {
  code: number;
  date: string;
};

export interface IAccountPaymentHistory {
  payment_history: ICreditReportTradelinePaymentHistoryItem[];
};

export default class AccountPaymentHistory extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('payment_history'));
  }

  /**
   * Retrieves payment history for an account
   * 
   * @param acc_id id of the account
   * @returns IAccountPaymentHistory
   */

  async retrieve() {
    return super._get<IAccountPaymentHistory>();
  }
};