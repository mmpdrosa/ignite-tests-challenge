import { getRepository, Repository } from 'typeorm';

import { Statement } from '../entities/Statement';
import { ICreateStatementDTO } from '../useCases/createStatement/ICreateStatementDTO';
import { IGetBalanceDTO } from '../useCases/getBalance/IGetBalanceDTO';
import { IGetStatementOperationDTO } from '../useCases/getStatementOperation/IGetStatementOperationDTO';
import { IStatementsRepository } from './IStatementsRepository';

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    amount,
    description,
    type,
    sender_id,
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type,
      sender_id,
    });

    return this.repository.save(statement);
  }

  async findStatementOperation({
    statement_id,
    user_id,
  }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.query(
      `SELECT * FROM statements WHERE id = $1 AND (user_id = $2 OR sender_id = $3)`,
      [statement_id, user_id, user_id]
    );
  }

  async getUserBalance({
    user_id,
    with_statement = false,
  }: IGetBalanceDTO): Promise<
    { balance: number } | { balance: number; statement: Statement[] }
  > {
    const statement = await this.repository
      .createQueryBuilder()
      .where('user_id = :user_id', { user_id })
      .orWhere('sender_id = :user_id', { user_id })
      .getMany();

    const balance = statement.reduce((acc, operation) => {
      if (
        operation.type === 'deposit' ||
        (operation.type === 'transfer' && operation.user_id === user_id)
      ) {
        return acc + Number(operation.amount);
      }
      return acc - operation.amount;
    }, 0);

    if (with_statement) {
      return {
        statement,
        balance,
      };
    }

    return { balance };
  }
}
