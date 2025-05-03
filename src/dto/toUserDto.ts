export interface UserResponseDTO {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const toUserDTO = (user: any): UserResponseDTO => ({
  id: user._id || user.id,
  email: user.email,
  name: user.name,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
