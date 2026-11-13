import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    // Verify genre exists
    const genre = await this.prisma.genre.findUnique({
      where: { id: createBookDto.genreId },
    });
    if (!genre) {
      throw new NotFoundException(`Genre with ID ${createBookDto.genreId} not found`);
    }

    // Check unique ISBN if provided
    if (createBookDto.isbn) {
      const existing = await this.prisma.book.findUnique({
        where: { isbn: createBookDto.isbn },
      });
      if (existing) {
        throw new ConflictException(`Book with ISBN "${createBookDto.isbn}" already exists`);
      }
    }

    return this.prisma.book.create({
      data: createBookDto,
      include: {
        genre: true,
      },
    });
  }

  async findAll(params?: {
    genreId?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params?.page ? Number(params.page) : 1;
    const limit = params?.limit ? Number(params.limit) : 10;
    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.BookWhereInput = {};

    if (params?.genreId !== undefined && params?.genreId !== null && !isNaN(Number(params.genreId))) {
      where.genreId = Number(params.genreId);
    }

    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { author: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.book.findMany({
      where,
      skip,
      take,
      include: {
        genre: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        genre: true,
        reviews: true,
      },
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.findOne(id);

    if (updateBookDto.genreId) {
      const genre = await this.prisma.genre.findUnique({
        where: { id: updateBookDto.genreId },
      });
      if (!genre) {
        throw new NotFoundException(`Genre with ID ${updateBookDto.genreId} not found`);
      }
    }

    if (updateBookDto.isbn) {
      const existing = await this.prisma.book.findUnique({
        where: { isbn: updateBookDto.isbn },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Book with ISBN "${updateBookDto.isbn}" already exists`);
      }
    }

    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
      include: {
        genre: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({
      where: { id },
    });
  }
}

