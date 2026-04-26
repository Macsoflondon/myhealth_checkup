type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDevelopment = import.meta.env.DEV;
  
  private log(level: LogLevel, message: string, data?: any) {
    // In production, only log warnings and errors
    if (!this.isDevelopment && (level === 'debug' || level === 'info')) {
      return;
    }
    
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    switch (level) {
      case 'error':
        console.error(prefix, message, data !== undefined ? data : '');
        break;
      case 'warn':
        console.warn(prefix, message, data !== undefined ? data : '');
        break;
      case 'info':
        console.info(prefix, message, data !== undefined ? data : '');
        break;
      case 'debug':
        console.log(prefix, message, data !== undefined ? data : '');
        break;
    }
  }
  
  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }
  
  info(message: string, data?: any) {
    this.log('info', message, data);
  }
  
  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }
  
  error(message: string, data?: any) {
    this.log('error', message, data);
  }
}

export const logger = new Logger();
