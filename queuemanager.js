class QueueManager {
    constructor() {
      this.fifoQueue = [];
      this.priorityQueue = [];
      this.roundRobinQueues = [[], [], []];
      this.rrIndex = 0;
    }
  
    addRequest(request, type) {
      switch (type) {
        case 'FIFO':
          this.fifoQueue.push(request);
          break;
        case 'PRIORITY':
          
          this.priorityQueue.push(request);
          this.priorityQueue.sort((a, b) => a.priority - b.priority);
          break;
        case 'ROUND_ROBIN':
          this.roundRobinQueues[this.rrIndex % this.roundRobinQueues.length].push(request);
          this.rrIndex++;
          break;
        default:
          throw new Error('Unknown queue type');
      }
    }
  
    getNextRequest(type) {
      switch (type) {
        case 'FIFO':
          return this.fifoQueue.shift();
        case 'PRIORITY':
          return this.priorityQueue.shift();
        case 'ROUND_ROBIN':
          const queue = this.roundRobinQueues[this.rrIndex % this.roundRobinQueues.length];
          this.rrIndex++;
          return queue.shift();
        default:
          throw new Error('Unknown queue type');
      }
    }
  
    hasRequests(type) {
      switch (type) {
        case 'FIFO':
          return this.fifoQueue.length > 0;
        case 'PRIORITY':
          return this.priorityQueue.length > 0;
        case 'ROUND_ROBIN':
          return this.roundRobinQueues.some(queue => queue.length > 0);
        default:
          throw new Error('Unknown queue type');
      }
    }
  }
  
  module.exports = QueueManager;
  