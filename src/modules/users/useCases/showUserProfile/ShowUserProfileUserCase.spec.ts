import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ShowUserProfileError } from './ShowUserProfileError';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Show User Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it('Should be able to show an user profile', async () => {
    const createdUser = await createUserUseCase.execute({
      name: 'User Name',
      email: 'user@rocketseat.com.br',
      password: '00000000',
    });

    const receivedUser = await showUserProfileUseCase.execute(
      createdUser.id as string
    );

    expect(receivedUser).toEqual(createdUser);
  });

  it('Should not be able to show an nonexistent user profile', async () => {
    await expect(showUserProfileUseCase.execute('1')).rejects.toBeInstanceOf(
      ShowUserProfileError
    );
  });
});
