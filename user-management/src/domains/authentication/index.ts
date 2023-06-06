import { MongoUsersRepository } from "../../repositories/users-repository/mongo-users-repository";
import { GenerateTokenController } from "./generate-token-controller";
import { GenerateRefreshTokenController } from "./generate-refresh-token-controller";
import { GenerateTokenService } from "./generate-token-service";
import { GenerateJWTToken } from "./tokens/adapters/generate-jwt-token";

const JWTTokenGenerator = new GenerateJWTToken();
const generateTokenService = new GenerateTokenService(JWTTokenGenerator);
const usersRepository = new MongoUsersRepository();
const generateTokenController = new GenerateTokenController(generateTokenService, usersRepository);
const generateRefreshTokenController = new GenerateRefreshTokenController(generateTokenService, usersRepository);

export { generateTokenController, generateRefreshTokenController };