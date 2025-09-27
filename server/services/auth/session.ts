export class Session {
  constructor(
    readonly id: string,
    readonly token: string,
    readonly userId: string,
    readonly expiresAt: Date,
  ) {}
}
