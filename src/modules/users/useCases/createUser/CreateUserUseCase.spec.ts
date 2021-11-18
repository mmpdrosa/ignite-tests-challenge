import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserError } from './CreateUserError';
import { CreateUserUseCase } from './CreateUserUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('Should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'User Name 1',
      email: 'user1@rocketseat.com.br',
      password: '11111111',
    });

    expect(user).toHaveProperty('id');
  });

  it('Should not be able to create a new user if user already exists', async () => {
    await createUserUseCase.execute({
      name: 'User Name 2',
      email: 'user2@rocketseat.com.br',
      password: '22222222',
    });

    await expect(
      createUserUseCase.execute({
        name: 'User Name 3',
        email: 'user2@rocketseat.com.br',
        password: '33333333',
      })
    ).rejects.toBeInstanceOf(CreateUserError);
  });
});
