import { UserModel } from '@user/models/user.schema';
// import { Helpers } from '@global/helpers/helpers';
import { IUserDocument } from '@user/interfaces/user.interface';

class UserService {
  public async addUserData(data: IUserDocument): Promise<void> {
    await UserModel.create(data);
  }
  // public async getUserByUsernameOrEmail(username: string, email: string): Promise<IUserDocument> {
  //   const query = {
  //     /* `$or` is a mongoose operator that allows you to query for multiple conditions. */
  //     $or: [{ username: Helpers.firstLetterUppercase(username) }, { email: Helpers.lowerCase(email) }]
  //   };
  //   const user: IUserDocument = (await UserModel.findOne(query).exec()) as IUserDocument;
  //   return user;
  // }
}

export const userService: UserService = new UserService();
