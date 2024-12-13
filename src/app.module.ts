import { Module } from '@nestjs/common';
import { FilerWatcherService } from './filer-watcher/filer-watcher.service';
import { SocketGateway } from './socket-gateway/socket-gateway.gateway';

@Module({
  providers: [SocketGateway, FilerWatcherService],
})
export class AppModule {}
