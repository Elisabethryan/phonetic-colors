import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { CreateLetterDto } from './dto/create-letter.dto';
import { UpdateLetterDto } from './dto/update-letter.dto';

@Injectable()
export class LetterService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createLetterDto: CreateLetterDto) {
    return 'This action adds a new letter';
  }

  findAll() {
    return this.databaseService.query(
      'SELECT ps.id, ps.spelling AS letter, p."styleType", p.color ' +
        'FROM "PhonemeSpelling" ps ' +
        'JOIN "Phoneme" p ON p.id = ps."phonemeId" ' +
        'ORDER BY ps.spelling ASC, ps.id ASC',
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} letter`;
  }

  update(id: number, updateLetterDto: UpdateLetterDto) {
    return `This action updates a #${id} letter`;
  }

  remove(id: number) {
    return `This action removes a #${id} letter`;
  }
}
