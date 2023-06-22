import { MongoUsersRepository } from "../users/repositories/mongo-users-repository";
import { TokensController } from "./tokens.controller";
import { GenerateTokenService } from "./generate-token.service";
import { GenerateJWTToken } from "./adapters/jwt.adapter";

const JWTTokenGenerator = new GenerateJWTToken();
const generateTokenService = new GenerateTokenService(JWTTokenGenerator);
const usersRepository = new MongoUsersRepository();
const tokensController = new TokensController(generateTokenService, usersRepository);

export { tokensController };