import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Blog } from '../../domain/blog.entity';

@Injectable()
export class BlogsTypeormRepository {
  constructor(
    @InjectRepository(Blog) private readonly blogsRepository: Repository<Blog>,
  ) {}

  async save(blog: Blog): Promise<void> {
    await this.blogsRepository.save(blog);
  }

  async findById(id: number): Promise<Blog | null> {
    // Blog | null
    return this.blogsRepository.findOneBy({
      id: id,
    });
  }

  async create(
    name: string,
    description: string,
    websiteUrl: string,
    isMembership: boolean,
  ): Promise<number> {
    const createdId: number = await this.blogsRepository
      .createQueryBuilder()
      .insert()
      .into(Blog)
      .values({
        name,
        description,
        websiteUrl,
        isMembership,
      })
      .returning('id') // Indicate want to return only id
      .execute()
      .then((result) => result.raw[0].id); // extract only id from result

    return createdId;
  }

  async update(
    id: number,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<boolean> {
    const result: UpdateResult = await this.blogsRepository.update(id, {
      name,
      description,
      websiteUrl,
    });

    return result.affected === 1;
  }

  async delete(id: number): Promise<boolean> {
    const result: DeleteResult = await this.blogsRepository.delete(id);

    return result.affected === 1;
  }
}