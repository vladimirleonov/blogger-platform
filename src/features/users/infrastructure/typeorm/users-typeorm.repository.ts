import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/user.entity';
import { EmailConfirmation } from '../../domain/email-confirmation';
import { PasswordRecovery } from '../../domain/password-recovery';

@Injectable()
export class UsersTypeormRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(EmailConfirmation)
    private readonly emailConfirmationRepository: Repository<EmailConfirmation>,
    @InjectRepository(PasswordRecovery)
    private readonly passwordRecoveryRepository: Repository<PasswordRecovery>,
  ) {}

  async findById(id: number) {
    // const query: string = `
    //   SELECT
    //     u.id,
    //     u.login,
    //     u.email,
    //     u.password,
    //     u.created_at AS "createdAt",
    //     ec.confirmation_code AS "emailConfirmationConfirmationCode",
    //     ec.expiration_date AS "emailConfirmationExpirationDate",
    //     ec.is_confirmed AS "emailConfirmationIsEmailConfirmed",
    //     pr.recovery_code AS "passwordRecoveryRecoveryCode",
    //     pr.expiration_date AS "passwordRecoveryExpirationDate"
    //   FROM users u
    //   LEFT JOIN email_confirmation ec ON u.id = ec.user_id
    //   LEFT JOIN password_recovery pr ON u.id = pr.user_id
    //   WHERE u.id = $1;
    // `;
    //
    // const result = await this.dataSource.query(query, [id]);
    //
    // return result.length > 0 ? result[0] : null;

    // User | null
    return await this.usersRepository.findOneBy({ id });
  }

  async findByField(field: string, value: string): Promise<any> {
    // const query: string = `SELECT
    //     u.id,
    //     u.login,
    //     u.email,
    //     u.password,
    //     u.created_at AS "createdAt",
    //     ec.confirmation_code AS "emailConfirmationConfirmationCode",
    //     ec.expiration_date AS "emailConfirmationExpirationDate",
    //     ec.is_confirmed AS "emailConfirmationIsEmailConfirmed",
    //     pr.recovery_code AS "passwordRecoveryRecoveryCode",
    //     pr.expiration_date AS "passwordRecoveryExpirationDate"
    //   FROM user u
    //   LEFT JOIN email_confirmation ec ON u.id = ec.user_id
    //   LEFT JOIN password_recovery pr ON u.id = pr.user_id
    //   WHERE "${field}" = $1`;
    //
    // const result = await this.dataSource.query(query, [value]);
    //
    // return result.length > 0 ? result[0] : null;

    // User | null
    return this.usersRepository.findOneBy({
      [field]: value,
    });
  }

  async findUserByConfirmationCode(confirmationCode: string): Promise<any> {
    // const query: string = `
    //   SELECT
    //     u.id,
    //     u.login,
    //     u.email,
    //     u.password,
    //     u.created_at AS "createdAt",
    //     ec.confirmation_code AS "emailConfirmationConfirmationCode",
    //     ec.expiration_date AS "emailConfirmationExpirationDate",
    //     ec.is_confirmed AS "emailConfirmationIsEmailConfirmed",
    //     pr.recovery_code AS "passwordRecoveryRecoveryCode",
    //     pr.expiration_date AS "passwordRecoveryExpirationDate"
    //   FROM users u
    //   LEFT JOIN email_confirmation ec ON u.id = ec.user_id
    //   LEFT JOIN password_recovery pr ON u.id = pr.user_id
    //   WHERE ec.confirmation_code=$1
    // `;
    //
    // const result = await this.dataSource.query(query, [confirmationCode]);
    //
    // return result.length > 0 ? result[0] : null;

    // User | null
    return this.usersRepository.findOne({
      where: {
        emailConfirmation: { confirmationCode },
      },
      relations: ['emailConfirmation'],
    });
  }

  async findUserByRecoveryCode(recoveryCode: string): Promise<any> {
    // const query: string = `
    //   SELECT
    //     u.id,
    //     u.login,
    //     u.email,
    //     u.password,
    //     u.created_at AS "createdAt",
    //     ec.confirmation_code AS "emailConfirmationConfirmationCode",
    //     ec.expiration_date AS "emailConfirmationExpirationDate",
    //     ec.is_confirmed AS "emailConfirmationIsEmailConfirmed",
    //     pr.recovery_code AS "passwordRecoveryRecoveryCode",
    //     pr.expiration_date AS "passwordRecoveryExpirationDate"
    //   FROM users u
    //   LEFT JOIN email_confirmation ec ON u.id = ec.user_id
    //   LEFT JOIN password_recovery pr ON u.id = pr.user_id
    //   WHERE recovery_code = $1
    // `;
    //
    // const result = await this.dataSource.query(query, [recoveryCode]);
    //
    // return result.length > 0 ? result[0] : null;

    // User | null
    return this.usersRepository.findOne({
      where: {
        passwordRecovery: { recoveryCode },
      },
      relations: ['passwordRecovery'],
    });
  }

  async findByEmail(email: string): Promise<any> {
    // const query: string = `
    //   SELECT
    //     u.id,
    //     u.login,
    //     u.email,
    //     u.password,
    //     u.created_at AS "createdAt",
    //     ec.confirmation_code AS "emailConfirmationConfirmationCode",
    //     ec.expiration_date AS "emailConfirmationExpirationDate",
    //     ec.is_confirmed AS "emailConfirmationIsEmailConfirmed",
    //     pr.recovery_code AS "passwordRecoveryRecoveryCode",
    //     pr.expiration_date AS "passwordRecoveryExpirationDate"
    //   FROM users u
    //   LEFT JOIN email_confirmation ec ON u.id = ec.user_id
    //   LEFT JOIN password_recovery pr ON u.id = pr.user_id
    //   WHERE u.email = $1;
    // `;
    //
    // const result = await this.dataSource.query(query, [email]);
    //
    // return result.length > 0 ? result[0] : null;

    // User | null
    return this.usersRepository.findOneBy({ email });
  }

  async findByLogin(login: string): Promise<any> {
    // const query: string = `
    //   SELECT
    //     u.id,
    //     u.login,
    //     u.email,
    //     u.password,
    //     u.created_at AS "createdAt",
    //     ec.confirmation_code AS "emailConfirmationConfirmationCode",
    //     ec.expiration_date AS "emailConfirmationExpirationDate",
    //     ec.is_confirmed AS "emailConfirmationIsEmailConfirmed",
    //     pr.recovery_code AS "passwordRecoveryRecoveryCode",
    //     pr.expiration_date AS "passwordRecoveryExpirationDate"
    //   FROM users u
    //   LEFT JOIN email_confirmation ec ON u.id = ec.user_id
    //   LEFT JOIN password_recovery pr ON u.id = pr.user_id
    //   WHERE u.login = $1;
    // `;
    //
    // const result = await this.dataSource.query(query, [login]);
    //
    // return result.length > 0 ? result[0] : null;

    // User | null
    return this.usersRepository.findOneBy({ login });
  }

  async findByLoginOrEmailField(loginOrEmail: string): Promise<any> {
    // const query: string = `
    //     SELECT
    //     u.id,
    //     u.login,
    //     u.email,
    //     u.password,
    //     u.created_at AS "createdAt",
    //     ec.confirmation_code AS "emailConfirmationConfirmationCode",
    //     ec.expiration_date AS "emailConfirmationExpirationDate",
    //     ec.is_confirmed AS "emailConfirmationIsEmailConfirmed",
    //     pr.recovery_code AS "passwordRecoveryRecoveryCode",
    //     pr.expiration_date AS "passwordRecoveryExpirationDate"
    //   FROM users u
    //   LEFT JOIN email_confirmation ec ON u.id = ec.user_id
    //   LEFT JOIN password_recovery pr ON u.id = pr.user_id
    //   WHERE login=$1 OR email=$1
    //   `;
    //
    // const result = await this.dataSource.query(query, [loginOrEmail]);
    //
    // return result.length > 0 ? result[0] : null;

    // User | null
    return this.usersRepository.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  }

  async create(
    login: string,
    passwordHash: string,
    email: string,
    emailConfirmationData: {
      confirmationCode: string;
      expirationDate: Date;
      isConfirmed: boolean;
    },
    passwordRecoveryData: {
      recoveryCode: string;
      expirationDate: Date;
    },
  ): Promise<User> {
    // return await this.dataSource.manager.transaction(async (manager) => {
    //   // create user and get id
    //   const userQuery: string = `
    //     INSERT INTO users(login, password, email)
    //     VALUES ($1, $2, $3)
    //     RETURNING id;
    //   `;
    //
    //   const userResult = await manager.query(userQuery, [
    //     login,
    //     generatedPasswordHash,
    //     email,
    //   ]);
    //
    //   const userId: number | null =
    //     userResult.length > 0 ? userResult[0].id : null;
    //
    //   if (!userId) {
    //     return null;
    //   }
    //
    //   // create email_confirmation record
    //   const emailConfirmationQuery: string = `
    //     INSERT INTO email_confirmation(user_id, confirmation_code, expiration_date, is_confirmed)
    //     VALUES ($1, $2, $3, $4)
    //   `;
    //
    //   await manager.query(emailConfirmationQuery, [
    //     userId,
    //     emailConfirmationData.confirmationCode,
    //     emailConfirmationData.expirationDate,
    //     emailConfirmationData.isConfirmed,
    //   ]);
    //
    //   // create password_recovery record
    //
    //   const passwordRecoveryQuery: string = `
    //     INSERT INTO password_recovery(user_id, recovery_code, expiration_date)
    //     VALUES ($1, $2, $3)
    //   `;
    //
    //   await manager.query(passwordRecoveryQuery, [
    //     userId,
    //     passwordRecoveryData.recoveryCode,
    //     passwordRecoveryData.expirationDate,
    //   ]);
    //
    //   // get after creating
    //   const userWithDetailsQuery: string = `
    //     SELECT
    //       u.id,
    //       u.login,
    //       u.email,
    //       u.password,
    //       u.created_at AS "createdAt",
    //       ec.confirmation_code AS "emailConfirmationConfirmationCode",
    //       ec.expiration_date AS "emailConfirmationExpirationDate",
    //       ec.is_confirmed AS "emailConfirmationIsEmailConfirmed",
    //       pr.recovery_code AS "passwordRecoveryRecoveryCode",
    //       pr.expiration_date AS "passwordRecoveryExpirationDate"
    //     FROM users u
    //     LEFT JOIN email_confirmation ec ON u.id = ec.user_id
    //     LEFT JOIN password_recovery pr ON u.id = pr.user_id
    //     WHERE u.id = $1;
    //   `;
    //
    //   const userWithDetailsResult = await manager.query(userWithDetailsQuery, [
    //     userId,
    //   ]);
    //
    //   return userWithDetailsResult.length > 0 ? userWithDetailsResult[0] : null;
    // });

    return this.dataSource.manager.transaction(async (manager) => {
      // Create user entity
      const newUser = manager.create(User, {
        login: login,
        password: passwordHash,
        email: email,
        createdAt: new Date(),
      });
      //console.log('newUser', newUser);

      const createdUser = await manager.save(newUser);
      console.log(' repo', createdUser);

      // Create email confirmation entity
      const emailConfirmation = manager.create(EmailConfirmation, {
        user: createdUser,
        confirmationCode: emailConfirmationData.confirmationCode,
        expirationDate: emailConfirmationData.expirationDate,
        isConfirmed: emailConfirmationData.isConfirmed,
      });
      // console.log('emailConfirmation', emailConfirmation);
      await manager.save(emailConfirmation);

      // Create password recovery
      const passwordRecovery = manager.create(PasswordRecovery, {
        user: createdUser,
        recoveryCode: passwordRecoveryData.recoveryCode,
        expirationDate: passwordRecoveryData.expirationDate,
      });
      //console.log('passwordRecovery', passwordRecovery);
      await manager.save(passwordRecovery);

      return createdUser;
    });
  }

  // async create(
  //   login: string,
  //   generatedPasswordHash: string,
  //   email: string,
  //   emailConfirmationData: {
  //     confirmationCode: string;
  //     expirationDate: Date;
  //     isConfirmed: boolean;
  //   },
  //   passwordRecoveryData: {
  //     recoveryCode: string;
  //     expirationDate: Date;
  //   },
  // ): Promise<string | null> {
  //   // create user and get id
  //
  //   const userQuery: string = `
  //     INSERT INTO users(login, password, email)
  //     VALUES ($1, $2, $3)
  //     RETURNING id;
  //   `;
  //
  //   const userResult = await this.dataSource.query(userQuery, [
  //     login,
  //     generatedPasswordHash,
  //     email,
  //   ]);
  //
  //   const userId: number | null =
  //     userResult.length > 0 ? userResult[0].id : null;
  //
  //   // create email_confirmation record
  //
  //   const emailConfirmationQuery: string = `
  //     INSERT INTO email_confirmation(user_id, confirmation_code, expiration_date, is_confirmed)
  //     VALUES ($1, $2, $3, $4)
  //   `;
  //
  //   await this.dataSource.query(emailConfirmationQuery, [
  //     userId,
  //     emailConfirmationData.confirmationCode,
  //     emailConfirmationData.expirationDate,
  //     emailConfirmationData.isConfirmed,
  //   ]);
  //
  //   // create password_recovery record
  //
  //   const passwordRecoveryQuery: string = `
  //     INSERT INTO password_recovery(user_id, recovery_code, expiration_date)
  //     VALUES ($1, $2, $3)
  //   `;
  //
  //   await this.dataSource.query(passwordRecoveryQuery, [
  //     userId,
  //     passwordRecoveryData.recoveryCode,
  //     passwordRecoveryData.expirationDate,
  //   ]);
  //
  //   const userWithDetailsQuery: string = `
  //     SELECT
  //       u.id,
  //       u.login,
  //       u.email,
  //       u.password,
  //       u.created_at AS "createdAt",
  //       ec.confirmation_code AS "emailConfirmationConfirmationCode",
  //       ec.expiration_date AS "emailConfirmationExpirationDate",
  //       ec.is_confirmed AS "emailConfirmationIsEmailConfirmed",
  //       pr.recovery_code AS "passwordRecoveryRecoveryCode",
  //       pr.expiration_date AS "passwordRecoveryExpirationDate"
  //     FROM users u
  //     LEFT JOIN email_confirmation ec ON u.id = ec.user_id
  //     LEFT JOIN password_recovery pr ON u.id = pr.user_id
  //     WHERE u.id = $1;
  //   `;
  //
  //   const userWithDetailsResult = await this.dataSource.query(
  //     userWithDetailsQuery,
  //     [userId],
  //   );
  //
  //   return userWithDetailsResult.length > 0 ? userWithDetailsResult[0] : null;
  // }

  async updatePasswordRecoveryData(
    recoveryCode: string,
    expirationDate: Date,
    userId: number,
  ): Promise<boolean> {
    // const query: string = `
    //   UPDATE password_recovery
    //   SET recovery_code = $1, expiration_date = $2
    //   WHERE user_id = $3
    // `;
    //
    // const result = await this.dataSource.query(query, [
    //   newRecoveryCode,
    //   newExpirationDate,
    //   userId,
    // ]);
    //
    // const updatedRowsCount: number = result[1];
    //
    // return updatedRowsCount === 1;

    const result: UpdateResult = await this.passwordRecoveryRepository.update(
      userId,
      {
        recoveryCode,
        expirationDate,
      },
    );

    return result.affected === 1;
  }

  async updateEmailConfirmationData(
    confirmationCode: string,
    expirationDate: Date,
    userId: number,
  ): Promise<boolean> {
    // const query: string = `
    //   UPDATE email_confirmation
    //   SET confirmation_code = $1, expiration_date = $2
    //   WHERE user_id = $3
    // `;
    //
    // const result = await this.dataSource.query(query, [
    //   newConfirmationCode,
    //   newExpirationDate,
    //   userId,
    // ]);
    //
    // const updatedRowsCount: number = result[1];
    //
    // return updatedRowsCount === 1;

    const result: UpdateResult = await this.emailConfirmationRepository.update(
      userId,
      {
        confirmationCode,
        expirationDate,
      },
    );

    return result.affected === 1;
  }

  async updateUserPasswordHashRecoveryCodeAndExpirationDate(
    passwordHash: string,
    recoveryCode: string,
    expirationDate: Date,
    userId: number,
  ) {
    // // update user
    // const queryUser: string = `
    //   UPDATE users
    //   SET password = $1
    //   WHERE id = $2
    // `;
    //
    // const updateUserResult = await this.dataSource.query(queryUser, [
    //   passwordHash,
    //   userId,
    // ]);
    //
    // const updatedUserRows = updateUserResult[1];
    //
    // // update password_recovery
    //
    // const queryPasswordRecovery: string = `
    //   UPDATE password_recovery
    //   SET recovery_code = $1, expiration_date = $2
    //   WHERE user_id = $3
    // `;
    //
    // const updatePasswordRecoveryResult = await this.dataSource.query(
    //   queryPasswordRecovery,
    //   [recoveryCode, expirationDate, userId],
    // );
    //
    // const updatedPasswordRecoveryRows = updatePasswordRecoveryResult[1];
    //
    // return updatedUserRows === 1 && updatedPasswordRecoveryRows === 1;ffec

    const userUpdateResult: UpdateResult = await this.usersRepository.update(
      userId,
      {
        password: passwordHash,
      },
    );

    const passwordRecoveryUpdateResult: UpdateResult =
      await this.passwordRecoveryRepository.update(userId, {
        recoveryCode,
        expirationDate,
      });

    return (
      userUpdateResult.affected === 1 &&
      passwordRecoveryUpdateResult.affected === 1
    );
  }

  async updateIsConfirmed(isConfirmed: boolean, userId: number) {
    // const query: string = `
    //   UPDATE email_confirmation
    //   SET is_confirmed=$1
    //   WHERE user_id=$2
    // `;
    //
    // const result = await this.dataSource.query(query, [isConfirmed, userId]);
    //
    // const updatedRowsCount: number = result[1];
    //
    // return updatedRowsCount === 1;

    const result: UpdateResult = await this.emailConfirmationRepository.update(
      userId,
      { isConfirmed },
    );

    return result.affected === 1;
  }

  async delete(id: string): Promise<boolean> {
    // const query: string = `DELETE FROM users WHERE id=$1`;
    //
    // const result = await this.dataSource.query(query, [id]);
    //
    // const deletedRowsCount: number = result[1];
    //
    // return deletedRowsCount === 1;

    const result: DeleteResult = await this.usersRepository.delete(id);

    return result.affected === 1;
  }
}
