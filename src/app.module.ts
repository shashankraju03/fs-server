import { Module } from '@nestjs/common';
import { FileWatcherService } from './file-watcher/file-watcher.service';
import { SocketGateway } from './socket-gateway/socket-gateway.gateway';

@Module({
  providers: [SocketGateway, FileWatcherService],
})
export class AppModule {}
