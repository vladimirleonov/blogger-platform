import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from '../../../../../base/types/object-result';
import { UsersTypeormRepository } from '../../../../users/infrastructure/typeorm/users-typeorm.repository';
import { CryptoService } from '../../../../../core/application/crypto.service';
import { randomUUID } from 'node:crypto';

export class SetNewPasswordCommand {
  constructor(
    public readonly newPassword: string,
    public readonly recoveryCode: string,
  ) {}
}

@CommandHandler(SetNewPasswordCommand)
export class SetNewPasswordUseCase
  implements ICommandHandler<SetNewPasswordCommand>
{
  constructor(
    private readonly usersPostgresRepository: UsersTypeormRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async execute(command: SetNewPasswordCommand): Promise<Result> {
    const { newPassword, recoveryCode } = command;

    const user =
      await this.usersPostgresRepository.findUserByRecoveryCode(recoveryCode);

    if (!user) {
      return Result.badRequest([
        {
          message: 'Incorrect recovery code',
          field: 'recoveryCode',
        },
      ]);
    }

    const currentDate: Date = new Date();
    const expirationDate: Date = user.passwordRecovery.expirationDate;

    if (expirationDate < currentDate) {
      return Result.badRequest([
        {
          message: 'Recovery code has expired',
          field: 'recoveryCode',
        },
      ]);
    }

    const saltRounds: number = 10;
    const passwordHash: string = await this.cryptoService.createHash(
      newPassword,
      saltRounds,
    );

    const userId: number = user.id;

    await this.usersPostgresRepository.updateUserPasswordHashRecoveryCodeAndExpirationDate(
      passwordHash,
      randomUUID(),
      new Date(),
      userId,
    );

    return Result.success();
  }
}
