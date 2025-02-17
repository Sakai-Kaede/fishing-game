import userRepository from "@/repositories/userRepository";
import fishRepository from "@/repositories/fishRepository";
import pokerRepository from "@/repositories/pokerRepository";

type Repositories = {
  user: typeof userRepository;
  fish: typeof fishRepository;
  poker: typeof pokerRepository;
};

const repositories: Repositories = {
  user: userRepository,
  fish: fishRepository,
  poker: pokerRepository,
};

export const RepositoryFactory = {
  get<K extends keyof Repositories>(name: K): Repositories[K] {
    return repositories[name];
  },
};
