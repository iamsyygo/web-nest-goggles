import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GithubService } from './github.service';
import { CreateGithubDto } from './dto/create-github.dto';
import { UpdateGithubDto } from './dto/update-github.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryGithubCommitsDto, QueryGithubRepoDto } from './dto/github.dto';
import { IsJwtPublic } from '@/decorator/is-jwt-public.decorator';

@ApiTags('github 相关接口')
@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @ApiOperation({ summary: '获取 commits 列表' })
  @IsJwtPublic()
  @Get('commits')
  findCommitAll(@Query() query: QueryGithubCommitsDto) {
    return this.githubService.findCommitAll(query);
  }

  @ApiOperation({ summary: '获取 repo 列表' })
  @IsJwtPublic()
  @Get('repos')
  findRepoAll(@Query() query: QueryGithubRepoDto) {
    return this.githubService.findRepoAll(query);
  }
}
