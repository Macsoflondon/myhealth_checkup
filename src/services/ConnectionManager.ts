type ConnectionEventType = 'online' | 'offline' | 'slow';

interface ConnectionListener {
  type: ConnectionEventType;
  callback: () => void;
}

export class ConnectionManager {
  private static instance: ConnectionManager;
  private listeners: ConnectionListener[] = [];
  private online: boolean = navigator.onLine;
  private connectionSpeed: 'fast' | 'slow' | 'offline' = 'fast';
  private pingInterval: NodeJS.Timeout | null = null;
  private readonly PING_INTERVAL = 30000; // 30 seconds
  private readonly SLOW_THRESHOLD = 2000; // 2 seconds

  private constructor() {
    this.setupListeners();
    this.startPingCheck();
  }

  public static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  private setupListeners(): void {
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  private handleOnline(): void {
    this.online = true;
    this.connectionSpeed = 'fast';
    this.notifyListeners('online');
    this.startPingCheck();
  }

  private handleOffline(): void {
    this.online = false;
    this.connectionSpeed = 'offline';
    this.notifyListeners('offline');
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private async checkConnectionQuality(): Promise<void> {
    if (!this.online) return;

    const startTime = Date.now();
    
    try {
      // Ping a lightweight endpoint
      await fetch('https://www.google.com/favicon.ico', {
        mode: 'no-cors',
        cache: 'no-cache',
      });
      
      const duration = Date.now() - startTime;
      const previousSpeed = this.connectionSpeed;
      
      if (duration > this.SLOW_THRESHOLD) {
        this.connectionSpeed = 'slow';
        if (previousSpeed !== 'slow') {
          this.notifyListeners('slow');
        }
      } else {
        this.connectionSpeed = 'fast';
        if (previousSpeed === 'slow') {
          this.notifyListeners('online');
        }
      }
    } catch (error) {
      // If ping fails but we're supposedly online, mark as offline
      if (this.online) {
        this.handleOffline();
      }
    }
  }

  private startPingCheck(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    
    this.pingInterval = setInterval(() => {
      this.checkConnectionQuality();
    }, this.PING_INTERVAL);
    
    // Immediate check
    this.checkConnectionQuality();
  }

  public on(type: ConnectionEventType, callback: () => void): void {
    this.listeners.push({ type, callback });
  }

  public off(type: ConnectionEventType, callback: () => void): void {
    this.listeners = this.listeners.filter(
      listener => !(listener.type === type && listener.callback === callback)
    );
  }

  private notifyListeners(type: ConnectionEventType): void {
    this.listeners
      .filter(listener => listener.type === type)
      .forEach(listener => listener.callback());
  }

  public isOnline(): boolean {
    return this.online;
  }

  public getConnectionSpeed(): 'fast' | 'slow' | 'offline' {
    return this.connectionSpeed;
  }

  public destroy(): void {
    window.removeEventListener('online', this.handleOnline.bind(this));
    window.removeEventListener('offline', this.handleOffline.bind(this));
    
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    
    this.listeners = [];
  }
}
