import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { SocketGateway } from 'src/socket-gateway/socket-gateway.gateway';

@Injectable()
export class FileWatcherService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly socketGateway: SocketGateway) {}

  private eofPointer: number = 0;
  private filePath = path.join(__dirname, '../../files/example.txt');

  onModuleInit() {
    this.startWatchingFile();
  }

  onModuleDestroy() {
    this.stopWatchingFile();
  }

  private startWatchingFile() {
    if (!fs.existsSync(this.filePath)) {
      console.error(`File not found: ${this.filePath}`);
      return;
    }

    console.log('Starting to watch file for changes...');

    fs.watchFile(this.filePath, { interval: 500 }, (curr, prev) => {
      console.log('File changed. Reading new content...');
      this.readFileChunk(curr, prev);
    });
  }

  private stopWatchingFile() {
    fs.unwatchFile(this.filePath);
    console.log('Stopped watching file for changes.');
  }

  private readFileChunk(curr: fs.Stats, prev: fs.Stats) {
    // Ensure there's new data to read
    if (prev.size >= curr.size) {
      console.log('No new data to read.');
      return;
    }

    if (curr.size >= prev.size) {
      const stream = fs.createReadStream(this.filePath, {
        start: prev.size,
        encoding: 'utf-8',
      });

      stream.on('data', (chunk) => {
        console.log(`Read chunk: ${chunk}`);
        this.socketGateway.emitMessage(chunk.toString());
      });

      stream.on('error', (err) => {
        console.error('Error reading file:', err.message);
      });

      stream.on('end', () => {
        console.log('Reached end of current file content.');
      });
    }
  }
}
