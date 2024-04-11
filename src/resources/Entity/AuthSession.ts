import Resource from "../../resource";
import Configuration from "../../configuration";

export interface IEntityAnswer {
  id: string,
  text: string,
}

export interface IEntityQuestion {
  id: string,
  text: string | null,
  answers: IEntityAnswer[],
}

export interface IAnswerOpts {
  question_id: string,
  answer_id: string,
}

export interface IEntityUpdateAuthOpts {
  answers: IAnswerOpts[],
}

export interface IEntityUpdateAuthResponse {
  questions: IEntityQuestion[],
  authenticated: boolean,
  cxn_id: string[],
  accounts: string[],
}

export interface IEntityQuestionResponse {
  questions: IEntityQuestion[]
  authenticated: boolean,
  cxn_id: string[],
  accounts: string[],
}

export default class EntityAuthSession extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('auth_session'));
  }

  /**
   * Creates an auth session for an entity
   * 
   * @param ent_id ent_id
   * @returns IEntityQuestionResponse
   */

  async create() {
    return super._create<IEntityQuestionResponse, {}>({});
  }

  /**
   * Updates and auth session with answers to KBA questions
   * 
   * @param ent_id ent_id
   * @param opts IEntityUpdateAuthOpts
   * @returns IEntityUpdateAuthResponse
   */

  async update(opts: IEntityUpdateAuthOpts) {
    return super._update<IEntityUpdateAuthResponse, IEntityUpdateAuthOpts>(opts);
  }
};