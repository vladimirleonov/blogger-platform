import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  Pagination,
  PaginationOutput,
} from '../../../base/models/pagination.base.model';
import { PostOutputModel } from './models/output/post.output.model';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { Result, ResultStatus } from '../../../base/types/object-result';
import { PostCreateModel } from './models/input/create-post.input.model';
import { PostUpdateModel } from './models/input/update-post.input.model';
import { SortingPropertiesType } from '../../../base/types/sorting-properties.type';
import { ParseMongoIdPipe } from '../../../core/pipes/parse-mongo-id.pipe';
import {
  InternalServerErrorException,
  NotFoundException,
} from '../../../core/exception-filters/http-exception-filter';
import { CommandBus } from '@nestjs/cqrs';
import { UpdatePostCommand } from '../application/use-cases/update-post.usecase';
import { DeletePostCommand } from '../application/use-cases/delete-post.usecase';
import { CurrentUserId } from '../../../core/decorators/param-decorators/current-user-id.param.decorator';
import { COMMENT_SORTING_PROPERTIES } from '../../comments/api/comments.controller';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query-repository';
import { CreatePostCommand } from '../application/use-cases/create-post.usecase';
import { PostUpdateLikeStatusModel } from './models/input/update-post-like-status.model';
import { UpdatePostLikeStatusCommand } from '../application/use-cases/update-post-like-status.usecase';
import { JwtAuthGuard } from '../../../core/guards/passport/jwt-auth.guard';
import { AuthService } from '../../auth/application/auth.service';
import { RequestWithOptionalUserId } from '../../../base/types/request-with-optional-userId';
import { OptionalJwtAuthGuard } from '../../../core/guards/passport/optional-jwt-auth-guard';
import { OptionalUserId } from '../../../core/decorators/param-decorators/current-user-optional-user-id.param.decorator';

export const POSTS_SORTING_PROPERTIES: SortingPropertiesType<PostOutputModel> =
  ['title', 'blogName'];

@Controller('posts')
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly authService: AuthService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}
  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  // TODO: change type any
  async getAll(@OptionalUserId() userId: string, @Query() query: any) {
    const pagination: Pagination = new Pagination(
      query,
      POSTS_SORTING_PROPERTIES,
    );

    const posts: PaginationOutput<PostOutputModel> =
      await this.postsQueryRepository.getAllPosts(pagination, userId);

    return posts;
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async getOne(
    @Param('id', new ParseMongoIdPipe()) id: string,
    @OptionalUserId() userId: string,
  ) {
    const post: PostOutputModel | null =
      await this.postsQueryRepository.findById(id, userId);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  @Get(':postId/comments')
  async getPostComments(
    @Param('postId', new ParseMongoIdPipe()) postId: string,
    @Query() query: any,
    @CurrentUserId() userId: string,
  ) {
    const pagination: Pagination = new Pagination(
      query,
      COMMENT_SORTING_PROPERTIES,
    );

    //? is it ok
    const post: PostOutputModel | null =
      await this.postsQueryRepository.findById(postId);

    if (!post) {
      throw new NotFoundException();
    }

    const comments: PaginationOutput<PostOutputModel> =
      await this.commentsQueryRepository.getAllPostComments(
        pagination,
        postId,
        userId,
      );

    return comments;
  }

  @Post()
  async create(@Body() createModel: PostCreateModel) {
    const { title, shortDescription, content, blogId } = createModel;

    const result: Result<string | null> = await this.commandBus.execute<
      CreatePostCommand,
      Result<string | null>
    >(new CreatePostCommand(title, shortDescription, content, blogId));

    // const result: Result<string | null> = await this.postsService.create(
    //   title,
    //   shortDescription,
    //   content,
    //   blogId,
    // );

    // TODO: add check wasn't before
    if (result.status === ResultStatus.NotFound) {
      throw new NotFoundException(result.errorMessage!);
    }

    const createdId: string = result.data!;

    const post: PostOutputModel | null =
      await this.postsQueryRepository.findById(createdId);

    if (!post) {
      // error if just created post not found
      throw new InternalServerErrorException();
    }

    return post;
  }

  @Put(':id')
  @HttpCode(204)
  async update(
    @Param('id', new ParseMongoIdPipe()) id: string,
    @Body() updateModel: PostUpdateModel,
  ) {
    // if (!req.user || !req.user.userId) {
    //   res.status(HTTP_CODES.UNAUTHORIZED).send()
    //   return
    // }

    const { title, shortDescription, content, blogId } = updateModel;

    const result: Result = await this.commandBus.execute<
      UpdatePostCommand,
      Result
    >(new UpdatePostCommand(id, title, shortDescription, content, blogId));

    // const result: Result = await this.postsService.update(
    //   id,
    //   title,
    //   shortDescription,
    //   content,
    //   blogId,
    // );

    if (result.status === ResultStatus.NotFound) {
      throw new NotFoundException(result.errorMessage!);
    }
  }

  @Put(':postId/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async updatePostLikeStatus(
    @Param('postId', new ParseMongoIdPipe()) postId: string,
    @CurrentUserId() userId: string,
    @Body() postUpdateLikeStatusModel: PostUpdateLikeStatusModel,
  ) {
    const { likeStatus } = postUpdateLikeStatusModel;
    console.log(postId, userId);
    const result: Result = await this.commandBus.execute(
      new UpdatePostLikeStatusCommand(likeStatus, postId, userId),
    );

    // const result: Result = await this.postService.updateLikeStatus(
    //   likeStatus,
    //   postId,
    //   userId,
    // );

    if (result.status === ResultStatus.NotFound) {
      throw new NotFoundException();
    }

    return;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseMongoIdPipe()) id: string) {
    const result: Result = await this.commandBus.execute<
      DeletePostCommand,
      Result
    >(new DeletePostCommand(id));

    // const result: Result = await this.postsService.delete(id);

    if (result.status === ResultStatus.NotFound) {
      throw new NotFoundException(result.errorMessage!);
    }
  }
}
