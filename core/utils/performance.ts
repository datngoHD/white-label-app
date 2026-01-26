import { logger } from '../logging/logger';

interface PerformanceMark {
  name: string;
  timestamp: number;
}

interface PerformanceMeasure {
  name: string;
  startMark: string;
  endMark: string;
  duration: number;
}

class PerformanceMonitor {
  private marks: Map<string, PerformanceMark> = new Map();
  private measures: PerformanceMeasure[] = [];
  private startupTime: number | null = null;

  mark(name: string): void {
    this.marks.set(name, {
      name,
      timestamp: Date.now(),
    });
  }

  measure(name: string, startMark: string, endMark: string): number | null {
    const start = this.marks.get(startMark);
    const end = this.marks.get(endMark);

    if (!start || !end) {
      logger.warn(`Performance marks not found: ${startMark}, ${endMark}`);
      return null;
    }

    const duration = end.timestamp - start.timestamp;
    const measure: PerformanceMeasure = {
      name,
      startMark,
      endMark,
      duration,
    };

    this.measures.push(measure);
    logger.debug(`Performance measure: ${name} = ${duration}ms`);

    return duration;
  }

  setStartupTime(time: number): void {
    this.startupTime = time;
    logger.info(`App startup time: ${time}ms`);
  }

  getStartupTime(): number | null {
    return this.startupTime;
  }

  getMeasures(): PerformanceMeasure[] {
    return [...this.measures];
  }

  clearMarks(): void {
    this.marks.clear();
  }

  clearMeasures(): void {
    this.measures = [];
  }

  clear(): void {
    this.clearMarks();
    this.clearMeasures();
  }
}

export const performanceMonitor = new PerformanceMonitor();

export const measureAsync = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const startMark = `${name}_start`;
  const endMark = `${name}_end`;

  performanceMonitor.mark(startMark);
  try {
    const result = await fn();
    performanceMonitor.mark(endMark);
    performanceMonitor.measure(name, startMark, endMark);
    return result;
  } catch (error) {
    performanceMonitor.mark(endMark);
    performanceMonitor.measure(name, startMark, endMark);
    throw error;
  }
};

export const measureSync = <T>(name: string, fn: () => T): T => {
  const startMark = `${name}_start`;
  const endMark = `${name}_end`;

  performanceMonitor.mark(startMark);
  try {
    const result = fn();
    performanceMonitor.mark(endMark);
    performanceMonitor.measure(name, startMark, endMark);
    return result;
  } catch (error) {
    performanceMonitor.mark(endMark);
    performanceMonitor.measure(name, startMark, endMark);
    throw error;
  }
};

export const trackRenderTime = (componentName: string): {
  start: () => void;
  end: () => void;
} => {
  const startMark = `render_${componentName}_start`;
  const endMark = `render_${componentName}_end`;

  return {
    start: () => performanceMonitor.mark(startMark),
    end: () => {
      performanceMonitor.mark(endMark);
      performanceMonitor.measure(`render_${componentName}`, startMark, endMark);
    },
  };
};
