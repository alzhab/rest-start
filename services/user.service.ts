import {UpdateAvatarI, UserI, UserPatchI, UserSignupI} from '../interfaces/user.interface';
import {UserModel} from '../models';
import {clearImage, throwError} from '../utils';
import {BaseService, BaseServiceI} from '../abstract/base.service';

export interface UserServiceI extends BaseServiceI<UserI, UserSignupI, UserPatchI>{
  updateAvatar({userId, avatarPath}: UpdateAvatarI): Promise<{message: string, filePath: string}>
  deleteAvatar(userId: string): Promise<{message: string}>
}

class UserService extends BaseService<UserI, UserSignupI, UserPatchI>{
  constructor(
  ) {
    super(UserModel);
  }

  async updateAvatar({userId, avatarPath}: UpdateAvatarI) {
    if (!userId) {
      throwError({
        code: 400,
        message: 'updateAvatar: UserId not defined'
      })
    }

    if (!avatarPath) {
      throwError({
        code: 400,
        message: 'updateAvatar: AvatarPath not defined'
      })
    }

    const user = await super.getById(userId, {
      attributes: ['avatarPath']
    });

    if (!user) {
      throwError({
        code: 404,
        message: 'User not found'
      })
    }

    if (user.avatarPath) {
      if (avatarPath !== user.avatarPath) {
        clearImage(user.avatarPath);
      }
    }

    await super.update({avatarPath}, {where: {id: userId}});

    return {
      message: "Avatar successfully updated",
      filePath: avatarPath
    }
  }

  async deleteAvatar(userId: string) {
    if (!userId) {
      throwError({
        code: 400,
        message: 'updateAvatar: UserId not defined'
      })
    }

    const user = await super.getById(userId,{
      attributes: ['avatarPath']
    });

    if (!user) {
      throwError({
        code: 404,
        message: 'User not found'
      })
    }

    if (user.avatarPath) {
      clearImage(user.avatarPath);
    } else {
      throwError({
        code: 404,
        message: 'User don\'t have avatar'
      })
    }

    await super.update({avatarPath: null}, {where: {id: userId}});

    return {
      message: "Avatar successfully deleted",
    }
  }
}

const userService = new UserService();

export default userService
