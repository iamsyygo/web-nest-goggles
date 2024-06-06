import { ApiProperty, PickType } from '@nestjs/swagger';

export class QueryGithubCommitsDto {
  @ApiProperty({ description: '拥有者', example: 'iamsyygo' })
  owner: string;

  @ApiProperty({ description: '仓库', example: 'web-nest-goggles' })
  repo: string;
  //   sha?: string;
  //   path?: string;
}

export class QueryGithubRepoDto extends PickType(QueryGithubCommitsDto, ['owner'] as const) {}
Add Github module to app module