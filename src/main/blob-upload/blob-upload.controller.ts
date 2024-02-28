import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  HttpCode,
  HttpException,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBlobUploadDto } from './dto/create-blob-upload.dto';
import { UpdateBlobUploadDto } from './dto/update-blob-upload.dto';
import { BlobUploadService } from './blob-upload.service';
import { SkipJwtPassport } from '../../decorator/skip-jwt-passport.decorator';
import { PageQueryDto } from './dto/query-blob-upload.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

@ApiTags('vercel blob 文件相关接口')
@Controller('blob-upload')
export class BlobUploadController {
  constructor(private readonly blobUploadService: BlobUploadService) {}
  // @ApiOperation({ description: '', summary: '创建 vercel blob 数据' })
  // @SkipJwtPassport()
  // @Post()
  // create(@Body() createBlobUploadDto: CreateBlobUploadDto) {
  //   return this.blobUploadService.create(createBlobUploadDto);
  // }

  @ApiOperation({ description: '', summary: 'vercel blob 上传' })
  @SkipJwtPassport()
  @ApiConsumes('multipart/form-data')
  // @UseInterceptors(
  //   AnyFilesInterceptor({
  //     limits: {
  //       fileSize: 4.5 * 1024 * 1024,
  //     },
  //   }),
  // )
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 4.5 * 1024 * 1024,
      },
    }),
  )
  @Post('upload')
  @HttpCode(201)
  upload(@UploadedFile() file: Express.Multer.File, @Body() body: CreateBlobUploadDto) {
    // try {
    //   return await this.blobUploadService.upload(req);
    // } catch (e) {
    //   throw new HttpException(e.message, e.status);
    // }
    return this.blobUploadService.upload(file);
  }

  // @Get()
  // findAll() {
  //   return this.blobUploadService.findAll();
  // }

  @ApiOperation({ description: '', summary: 'vercel blob 列表查询' })
  @SkipJwtPassport()
  @Get('/list')
  findList(@Query() pageQueryDto: PageQueryDto) {
    return this.blobUploadService.findList(pageQueryDto);
  }

  @ApiOperation({ description: '', summary: '根据 id 查询' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blobUploadService.findOne(+id);
  }

  // @ApiOperation({ description: '', summary: '更新 vercel blob' })
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBlobUploadDto: UpdateBlobUploadDto) {
  //   return this.blobUploadService.update(+id, updateBlobUploadDto);
  // }

  @ApiOperation({ description: '', summary: '删除 vercel blob' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blobUploadService.remove(+id);
  }
}
