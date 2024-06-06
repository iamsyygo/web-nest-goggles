import { Injectable } from '@nestjs/common';
import { CreateGithubDto } from './dto/create-github.dto';
import { UpdateGithubDto } from './dto/update-github.dto';
import { QueryGithubCommitsDto, QueryGithubRepoDto } from './dto/github.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubService {
  constructor(private readonly configService: ConfigService) {}
  async findCommitAll(query: QueryGithubCommitsDto) {
    const access_token = this.configService.get('github.access_token');
    const url = `https://api.github.com/repos/${query.owner}/${query.repo}/commits`;
    const results = await axios.get(url, {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
    return results.data;
  }

  async findRepoAll(query: QueryGithubRepoDto) {
    const access_token = this.configService.get('github.access_token');
    const url = `https://api.github.com/users/${query.owner}/repos`;
    const results = await axios.get(url, {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
    return results.data;
  }
}
