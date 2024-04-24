import Resource, { IResourceError, IResourceListOpts, TResourceStatus } from '../../resource';
import Configuration from '../../configuration';
import type {
  TAccountLiabilityTypes,
  IAccountLiabilityAutoLoan,
  IAccountLiabilityCollection,
  IAccountLiabilityCreditBuilder,
  IAccountLiabilityCreditCard,
  IAccountLiabilityInsurance,
  IAccountLiabilityLoan,
  IAccountLiabilityMedical,
  IAccountLiabilityMortgage,
  IAccountLiabilityPersonalLoan,
  IAccountLiabilityStudentLoan,
  IAccountLiabilityStudentLoans,
  IAccountLiabilityUtility,
} from './types';


export interface IAccountUpdate {
  id: string;
  status: TResourceStatus;
  account_id: string;
  type: TAccountLiabilityTypes;
  auto_loan?: IAccountLiabilityAutoLoan;
  collection?: IAccountLiabilityCollection;
  credit_builder?: IAccountLiabilityCreditBuilder;
  credit_card?: IAccountLiabilityCreditCard;
  insurance?: IAccountLiabilityInsurance;
  loan?: IAccountLiabilityLoan;
  medical?: IAccountLiabilityMedical;
  mortgage?: IAccountLiabilityMortgage;
  personal_loan?: IAccountLiabilityPersonalLoan;
  student_loan?: IAccountLiabilityStudentLoan;
  student_loans?: IAccountLiabilityStudentLoans;
  utility?: IAccountLiabilityUtility;
  error: IResourceError | null;
  created_at: string;
  updated_at: string;
};

export default class AccountUpdates extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('updates'));
  }

  /**
   * Creates a new Update for a liability Account.
   * 
   * @returns Returns an Update object.
   */

  async create() {
    return super._create<IAccountUpdate, {}>({});
  }

  /**
   * Retrieve an Update object by its ID.
   * 
   * @param upt_id ID of the Update
   * @returns Returns an Update object.
   */

  async retrieve(upt_id: string) {
    return super._getWithId<IAccountUpdate>(upt_id);
  }

  /**
   * Retrieve a list of Updates for a specific Account.
   * 
   * @returns Returns a list of Updates.
   */

  async list(opts?: IResourceListOpts) {
    return super._list<IAccountUpdate, IResourceListOpts>(opts);
  }
};
