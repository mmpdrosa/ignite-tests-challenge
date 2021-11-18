import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { GetStatementOperationError } from './GetStatementOperationError';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

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
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it('Should be able to get an statement operation', async () => {
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

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(statementOperation).toEqual(statement);
  });

  it('Should not be able to get an statement operation if user is not found', async () => {
    const user = await createUserUseCase.execute({
      name: 'User Name 2',
      email: 'user2@rocketseat.com.br',
      password: '22222222',
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: 'deposit' as OperationType,
      amount: 100,
      description: 'Deposit Statement Description Example',
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: '1',
        statement_id: statement.id as string,
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it('Should not be able to get an statement operation if statement is not found', async () => {
    const user = await createUserUseCase.execute({
      name: 'User Name 3',
      email: 'user3@rocketseat.com.br',
      password: '33333333',
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: 'deposit' as OperationType,
      amount: 100,
      description: 'Deposit Statement Description Example',
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: '1',
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
