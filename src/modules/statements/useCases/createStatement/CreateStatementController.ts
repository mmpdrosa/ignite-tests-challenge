import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { user_id: reciever_id } = request.params;
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split('/');

    const type = (
      reciever_id
        ? splittedPath[splittedPath.length - 2]
        : splittedPath[splittedPath.length - 1]
    ) as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);

    const sender_id = reciever_id ? user_id : undefined;

    const statement = await createStatement.execute({
      user_id: reciever_id || user_id,
      sender_id,
      type,
      amount,
      description,
    });

    return response.status(201).json(statement);
  }
}
