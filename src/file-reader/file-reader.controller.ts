import { Controller, Get, Query } from '@nestjs/common';
import { FileReaderService } from './file-reader.service';

@Controller('file-reader')
export class FileReaderController {
  constructor(private readonly fileReaderService: FileReaderService) {}
  @Get(':lines')
  getLast10lines(@Query() query: { lines: number; bufferSizeInBytes: number }) {
    return this.fileReaderService.getLast10lines(
      query.lines,
      query.bufferSizeInBytes,
    );
  }
}
