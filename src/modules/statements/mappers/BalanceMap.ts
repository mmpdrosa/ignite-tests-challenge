import { Statement } from '../entities/Statement';

export class BalanceMap {
  static toDTO({
    statement,
    balance,
  }: {
    statement: Statement[];
    balance: number;
  }) {
    const parsedStatement = statement.map(
      ({
        id,
        sender_id,
        amount,
        description,
        type,
        created_at,
        updated_at,
      }) => {
        const statement = {
          id,
          amount: Number(amount),
          description,
          type,
          created_at,
          updated_at,
        };

        if (type === 'transfer') {
          Object.assign(statement, {
            sender_id,
          });
        }

        return statement;
      }
    );

    return {
      statement: parsedStatement,
      balance: Number(balance),
    };
  }
}
