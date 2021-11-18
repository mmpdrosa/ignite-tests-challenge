import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { GetBalanceError } from './GetBalanceError';
import { GetBalanceUseCase } from './GetBalanceUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it('Should be able to get an user balance', async () => {
    const user = await createUserUseCase.execute({
      name: 'User Name 1',
      email: 'user1@rocketseat.com.br',
      password: '11111111',
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: 'deposit' as OperationType,
      amount: 100,
      description: 'Deposit Statement Description Example',
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: 'withdraw' as OperationType,
      amount: 50,
      description: 'Withdraw Statement Description Example',
    });

    const response = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(response).toHaveProperty('statement');
    expect(response).toHaveProperty('balance');
    expect(response.balance).toEqual(50);
    expect(response.statement.length).toBe(2);
  });

  it('Should not be able to get an user balance if user does not exist', async () => {
    await expect(
      getBalanceUseCase.execute({ user_id: '1' })
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
});
