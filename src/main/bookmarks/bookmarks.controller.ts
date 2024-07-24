import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { IsJwtPublic } from '@/decorator/is-jwt-public.decorator';

@ApiTags('浏览器收藏标签相关接口')
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  create(@Body() createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarksService.create(createBookmarkDto);
  }

  @Get()
  findAll() {
    return this.bookmarksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookmarksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookmarkDto: UpdateBookmarkDto) {
    return this.bookmarksService.update(+id, updateBookmarkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookmarksService.remove(+id);
  }

  @ApiBody({
    description: '上传文件',
    type: CreateBookmarkDto,
  })
  @IsJwtPublic()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Post('import')
  async addBookmark(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: 'text/html' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.bookmarksService.addBookmark(file.buffer.toString());
  }
}
