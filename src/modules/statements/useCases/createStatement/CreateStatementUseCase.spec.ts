import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementError } from './CreateStatementError';
import { CreateStatementUseCase } from './CreateStatementUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create Statement', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it('Should be able to create a new deposit statement', async () => {
    const user = await createUserUseCase.execute({
      name: 'User Name 1',
      email: 'user1@rocketseat.com.br',
      password: '11111111',
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: 'deposit' as OperationType,
      amount: 100,
      description: 'Deposit Statement Description Example',
    });

    expect(statement).toHaveProperty('id');
  });

  it('Should be able to create a new withdraw statement', async () => {
    const user = await createUserUseCase.execute({
      name: 'User Name 2',
      email: 'user2@rocketseat.com.br',
      password: '22222222',
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: 'deposit' as OperationType,
      amount: 100,
      description: 'Deposit Statement Description Example',
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: 'withdraw' as OperationType,
      amount: 50,
      description: 'Withdraw Statement Description Example',
    });

    expect(statement).toHaveProperty('id');
  });

  it('Should not be able to create a new statement if user is not found', async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: '1',
        type: 'deposit' as OperationType,
        amount: 100,
        description: 'Deposit Statement Description Example',
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it('Should not be able to create a new withdraw statement if funds are insufficient', async () => {
    const user = await createUserUseCase.execute({
      name: 'User Name 3',
      email: 'user3@rocketseat.com.br',
      password: '33333333',
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: 'deposit' as OperationType,
      amount: 50,
      description: 'Deposit Statement Description Example',
    });

    await expect(
      createStatementUseCase.execute({
        user_id: user.id as string,
        type: 'withdraw' as OperationType,
        amount: 100,
        description: 'Withdraw Statement Description Example',
      })
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
