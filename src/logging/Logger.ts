export class Logger {
  reportError(message: string, line?: number) {
    let prefix = '';
    if (line) {
      prefix = `[Line ${line}]: `;
    }
    console.error(prefix + message);
  }
}