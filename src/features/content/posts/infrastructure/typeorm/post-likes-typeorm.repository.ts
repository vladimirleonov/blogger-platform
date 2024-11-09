import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeStatus } from '../../../../../base/types/like-status';
import { PostLike } from '../../../like/domain/like.entity';

@Injectable()
export class PostLikesTypeormRepository {
  constructor(
    @InjectRepository(PostLike)
    private readonly postLikesRepository: Repository<PostLike>,
  ) {}

  async save(like: PostLike): Promise<void> {
    await this.postLikesRepository.save(like);
  }

  async findById(postId: number, userId: number): Promise<PostLike | null> {
    const post: PostLike | null = await this.postLikesRepository.findOneBy({
      postId: postId,
      authorId: userId,
    });

    return post;
  }

  // async create(postId: number, userId: number, likeStatus: LikeStatus) {
  //   const query: string = `
  //     INSERT INTO post_likes (post_id, author_id, status)
  //     VALUES ($1, $2, $3)
  //     RETURNING id;
  //   `;
  //
  //   const result = await this.dataSource.query(query, [
  //     postId,
  //     userId,
  //     likeStatus,
  //   ]);
  //
  //   const createdId: number = result[0].id;
  //
  //   return createdId;
  // }

  async update(postId: number, userId: number, likeStatus: LikeStatus) {
    const result = await this.postLikesRepository.update(
      { postId },
      { authorId: userId, status: likeStatus },
    );

    return result.affected === 1;
  }

  async delete(postId: number, userId: number) {
    const result = await this.postLikesRepository.delete({
      postId,
      authorId: userId,
    });

    return result.affected === 1;
  }
}