import { User } from "@/src/domain/User/User";
import { IUserRepository } from "@/src/domain/User/User";

interface RegisterUserInput {
  username: string;
  password: string;
}
interface RegisterUserOutput {
  username: string;
  userId: string;
}

export class ResisterUserUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const { username, password } = input;
    const newUser = new User(username, password);
    const savedUser = await this.userRepository.authUser(
      newUser.getUser().username,
      newUser.getUser().userId,
      newUser.getUser().password
    );
    return {
      username: savedUser.username,
      userId: savedUser.userId,
    };
  }
}
