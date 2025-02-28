import { IsEnum, IsString, MinLength } from 'class-validator';
import { Trim } from '../../../../../../core/decorators/transformers/trim';
import { LikeStatus } from '../../../../../../base/types/like-status';

export class CommentLikeStatusUpdateModel {
  @IsString()
  @Trim()
  @MinLength(1, { message: 'Length not correct' })
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
