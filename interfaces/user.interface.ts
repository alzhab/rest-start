export interface UserI {
  id?: string | null;
  username: string;
  phoneNumber?: string | null;
  passwordResetCode?: string | null;
  email: string;
  password: string;
  avatarPath?: string | null;
  createdAt?: Date;
}

export interface UserSignupI {
  email: string;
  password: string;
  username: string;
}

export interface UserLoginI {
  email: string;
  password: string;
}

export interface UserPatchI {
  username?: string;
  phoneNumber?: string | null;
  passwordResetCode?: string | null;
  email?: string;
  password?: string;
  avatarPath?: string | null;
}

export interface UpdateAvatarI {
  userId: string;
  avatarPath: string
}

export interface AddFavoriteI {
  productId: string;
  userId: string
}

export interface DeleteFavoriteI {
  productId: string;
  userId: string
}
