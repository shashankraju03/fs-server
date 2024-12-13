import { Module } from '@nestjs/common';
import { FileReaderController } from './file-reader/file-reader.controller';
import { FileReaderService } from './file-reader/file-reader.service';
import { FileWatcherService } from './file-watcher/file-watcher.service';
import { SocketGateway } from './socket-gateway/socket-gateway.gateway';

@Module({
  providers: [SocketGateway, FileWatcherService, FileReaderService],
  controllers: [FileReaderController],
})
export class AppModule {}
