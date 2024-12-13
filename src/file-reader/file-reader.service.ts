import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileReaderService {
  private filePath = path.join(__dirname, '../../files/example.txt');
  getLast10lines(numLines: number, bufferSize: number) {
    const fileStats = fs.statSync(this.filePath); // Get file stats to know the size
    const fileSize = fileStats.size;
    // 10Bytes buffer size to read in chunks

    let fileDescriptor = null;
    let position = fileSize; // Start at the end of the file

    try {
      fileDescriptor = fs.openSync(this.filePath, 'r');
      let loopCount = 1;
      while (position > 0) {
        const lines = [];
        // Calculate bytes to read from the file based on the remaining file size
        // Ensure we don't read past the start of the file

        // Move the position pointer backward
        position -= bufferSize;

        const bytesToRead = fileSize - position;

        console.log(position, bytesToRead, fileSize);

        let buffer = Buffer.alloc(bytesToRead);

        // Read a chunk from the file
        fs.readSync(fileDescriptor, buffer, 0, bytesToRead, position);

        // Process the chunk
        const chunk = buffer.toString('utf-8', 0, bytesToRead);
        const linesInChunk = chunk.split(/\r?\n/);

        // Add the lines in reverse order, because we're reading from the end
        lines.unshift(...linesInChunk.reverse());

        // Stop if we've accumulated enough lines
        if (lines.length - 1 >= numLines) {
          return lines.slice(0, numLines).join('\n');
        }
        loopCount++;
      }
    } catch (err) {
      console.error('Error reading file:', err);
    } finally {
      if (fileDescriptor !== null) {
        fs.closeSync(fileDescriptor);
      }
    }
  }
}
