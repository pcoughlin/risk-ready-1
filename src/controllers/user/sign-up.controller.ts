import { IUserRepo, UserDTO } from "../../entities/interfaces/user.interface";
import UserRepo from "../../entities/repositories/user.repository";
import emailVerification from "../../notification/email-verification.notification";
import { BaseController } from "../base.controller";

class SignUpController extends BaseController {
    private UserRepo: IUserRepo;

    public constructor() {
        super();

        this.UserRepo = new UserRepo
    }
    protected async executeImpl(): Promise<any> {
        try {
            const userInfo = this.req.body;
            const userProfilePhoto = this.req.file;

            const signUp = await this.UserRepo.signUp(userInfo, userProfilePhoto);

            emailVerification(signUp.email);

            return this.ok<UserDTO>(this.res, signUp, 'User signed up successfully');
        } catch (error: any) {
            if (error?.name == 'SequelizeValidationError') {
                return this.clientError(error, 422);
            }
            else {
                return this.clientError(error);
            }
        }
    }
}

export default SignUpController