import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { SocketGateway } from 'src/socket-gateway/socket-gateway.gateway';

@Injectable()
export class FilerWatcherService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly socketGateway: SocketGateway) {}

  onModuleInit() {
    this.startReadingFile();
  }

  onModuleDestroy() {
    this.stopReadingFile();
  }

  private eofPointer: number = 0;

  private filePath = path.join(__dirname, '../../files/example.txt');

  private intervalId: NodeJS.Timeout;

  private startReadingFile() {
    if (!fs.existsSync(this.filePath)) {
      console.error(`File not found: ${this.filePath}`);
      return;
    }

    console.log('Starting file read operation....');

    this.intervalId = setInterval(() => {
      this.readFileChunk();
    }, 500);
  }

  private stopReadingFile() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      console.log('Stopped file read operation.');
    }
  }

  private readFileChunk() {
    const fileStats = fs.statSync(this.filePath);
    // console.log(`File size: ${fileStats.size}, eofPointer: ${this.eofPointer}`);

    if (this.eofPointer >= fileStats.size) {
      console.log('No new data to read.');
      return;
    }

    const stream = fs.createReadStream(this.filePath, {
      start: this.eofPointer,
      encoding: 'utf-8',
    });

    console.log('Stream created. Waiting for data...');

    stream.on('data', (chunk) => {
      console.log(`Read chunk: ${chunk}`);
      this.eofPointer += Buffer.byteLength(chunk, 'utf-8');
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
