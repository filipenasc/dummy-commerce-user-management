import { Request, Response } from "express";
import { BaseController } from "./base";
import { InvalidParameterError } from "@src/lib/errors";
import { PasswordGrantType } from "@src/services/credentialsGrant/passwordGrantType";
import { RefreshTokenGrantType } from "@src/services/credentialsGrant/refreshTokenGrantType";

type GrantTypes = {
  [key: string]: GrantType;
}

const grantTypes: GrantTypes = {
  password: PasswordGrantType,
  refresh_token: RefreshTokenGrantType,
}

export type GrantType = typeof PasswordGrantType | typeof RefreshTokenGrantType;

export class AuthController extends BaseController {
  public async token(req: Request, res: Response): Promise<void> {
    try {
      const { grant_type } = req.body;

      const grantTypeService = this.createGrantTypeService(grant_type);
      const credentials = await grantTypeService.grantCredentials(req.body)

      res.status(200).send(credentials)
    } catch (error) {
      this.sendErrorResponse(res, error as Error);
    }
  }

  private createGrantTypeService(grantType: string): GrantType {
    if (!grantType) throw new InvalidParameterError('grant_type', 'required');

    const grantTypeService = grantTypes[grantType];

    if (!grantTypeService) throw new InvalidParameterError('grant_type', 'not_supported');

    return grantTypeService;
  }
}
