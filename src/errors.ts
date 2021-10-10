const MethodErrorTypes = {
   INVALID_AUTHORIZATION: 'INVALID_AUTHORIZATION',
   INVALID_REQUEST: 'INVALID_REQUEST',
   API_ERROR: 'API_ERROR',
};

type TMethodErrorTypes =
  | 'INVALID_AUTHORIZATION'
  | 'INVALID_REQUEST'
  | 'API_ERROR';

export interface MethodErrorOpts {
  type: TMethodErrorTypes;
  sub_type: string;
  message: string;
  code: number;
}

export class MethodError extends Error {
  type: TMethodErrorTypes;
  sub_type: string;
  message: string;
  code: number;

  constructor(opts: MethodErrorOpts) {
    super();
    this.type = opts.type;
    this.sub_type = opts.sub_type;
    this.message = opts.message;
    this.code = opts.code;
  }

  static generate(opts: MethodErrorOpts): MethodError {
    switch (opts.type) {
      case MethodErrorTypes.API_ERROR: return new MethodInternalError(opts);
      case MethodErrorTypes.INVALID_REQUEST: return new MethodInvalidRequestError(opts);
      case MethodErrorTypes.INVALID_AUTHORIZATION: return new MethodAuthorizationError(opts);
    }
  }
}

export class MethodInternalError extends MethodError {}

export class MethodInvalidRequestError extends MethodError {}

export class MethodAuthorizationError extends MethodError {}
