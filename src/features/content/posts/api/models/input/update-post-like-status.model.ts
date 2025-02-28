import { IsEnum, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../../core/decorators/transformers/trim';
import { LikeStatus } from '../../../../../../base/types/like-status';

export class PostUpdateLikeStatusModel {
  @IsString()
  @Trim()
  @Length(1, 30, { message: 'Length not correct' })
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
