import { IUserRepository } from "@/src/domain/User/User";
import { User } from "@/src/domain/User/User";

interface RegisterUserInput {
  userName: string;
  password: string;
}
interface RegisterUserOutput {
  userName: string;
  message: string;
}

export class RegisterUserUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const { userName, password } = input;
    const existingUser = await this.userRepository.findUserByUsername(userName);
    if (existingUser) {
      throw new Error("指定されたユーザー名は既に使用されています。");
    }
    const newUser = new User(userName, password);
    const savedUser = await this.userRepository.authUser(
      newUser.getUser().userName,
      newUser.getUser().password
    );

    return {
      userName: savedUser.userName,
      message: "ユーザー登録が完了しました。",
    };
  }
}