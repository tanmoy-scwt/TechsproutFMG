import { AuthError } from "next-auth";

interface Err extends Partial<Error> {
   status: boolean;
   message: string;
}

export class CustomAuthError extends AuthError {
   status;
   message;
   constructor(error: Err) {
      super();
      this.status = error.status;
      this.message = error.message;
   }
}
