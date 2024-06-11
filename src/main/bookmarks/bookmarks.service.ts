import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { Bookmark } from './entities/bookmark.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BookmarksService {
  @InjectRepository(Bookmark)
  private bookmarkRepository: Repository<Bookmark>;

  create(createBookmarkDto: CreateBookmarkDto) {
    return 'This action adds a new bookmark';
  }

  findAll() {
    return `This action returns all bookmarks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookmark`;
  }

  update(id: number, updateBookmarkDto: UpdateBookmarkDto) {
    return `This action updates a #${id} bookmark`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookmark`;
  }

  async addBookmark(html: string) {
    const cheerio = require('cheerio');
    const $ = cheerio.load(html);

    const bookmarks = [];
    $('a').each((index, element) => {
      const title = $(element).text();
      const url = $(element).attr('href');
      const addDate = $(element).attr('add_date');
      const icon = $(element).attr('icon');
      if (title && url) {
        bookmarks.push({ title, url, addDate, icon });
      }
    });
    // 存在相同 url 覆盖
    // 批量插入
    await this.bookmarkRepository.save(bookmarks);
    return bookmarks;
  }
}
