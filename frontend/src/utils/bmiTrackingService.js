class BMITrackingService {
  constructor() {
    this.dbName = 'HolisticWellnessDB';
    this.dbVersion = 2;
    this.storeName = 'bmiTracking';
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create BMI tracking store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
          
          // Create indexes for efficient querying
          store.createIndex('userId', 'userId', { unique: false });
          store.createIndex('date', 'date', { unique: false });
          store.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  async saveBMIData(bmiData, heightImperial, bmiResult) {
    const db = await this.initDB();
    const transaction = db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);

    // Save BMI data
    const bmiEntry = {
      type: 'bmiData',
      userId: 'currentUser', // You can make this dynamic based on login
      bmiData,
      heightImperial,
      bmiResult,
      timestamp: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const request = store.add(bmiEntry);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveDailyEntry(date, target, actual, status) {
    const db = await this.initDB();
    const transaction = db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);

    const entry = {
      type: 'dailyEntry',
      userId: 'currentUser',
      date,
      target,
      actual,
      status,
      timestamp: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const request = store.add(entry);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getBMIData() {
    const db = await this.initDB();
    const transaction = db.transaction([this.storeName], 'readonly');
    const store = transaction.objectStore(this.storeName);
    const index = store.index('type');

    return new Promise((resolve, reject) => {
      const request = index.getAll('bmiData');
      request.onsuccess = () => {
        const entries = request.result;
        if (entries.length > 0) {
          // Get the most recent BMI data
          const latest = entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
          resolve({
            bmiData: latest.bmiData,
            heightImperial: latest.heightImperial,
            bmiResult: latest.bmiResult
          });
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getDailyEntries() {
    const db = await this.initDB();
    const transaction = db.transaction([this.storeName], 'readonly');
    const store = transaction.objectStore(this.storeName);
    const index = store.index('type');

    return new Promise((resolve, reject) => {
      const request = index.getAll('dailyEntry');
      request.onsuccess = () => {
        const entries = request.result;
        // Convert to the format expected by the component
        const dailyEntries = entries.map(entry => ({
          date: entry.date,
          target: entry.target,
          actual: entry.actual,
          status: entry.status
        }));
        resolve(dailyEntries);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async updateDailyEntry(date, target, actual, status) {
    const db = await this.initDB();
    const transaction = db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    const index = store.index('type');

    // First, find existing entry for this date
    const request = index.getAll('dailyEntry');
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const entries = request.result;
        const existingEntry = entries.find(entry => entry.date === date);
        
        if (existingEntry) {
          // Update existing entry
          existingEntry.target = target;
          existingEntry.actual = actual;
          existingEntry.status = status;
          existingEntry.timestamp = new Date().toISOString();
          
          const updateRequest = store.put(existingEntry);
          updateRequest.onsuccess = () => resolve(existingEntry);
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          // Add new entry
          this.saveDailyEntry(date, target, actual, status)
            .then(resolve)
            .catch(reject);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllData() {
    const db = await this.initDB();
    const transaction = db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getStats() {
    const dailyEntries = await this.getDailyEntries();
    const bmiData = await this.getBMIData();
    
    if (!dailyEntries.length || !bmiData) {
      return null;
    }

    const totalCalories = dailyEntries.reduce((sum, entry) => sum + entry.actual, 0);
    const totalTarget = dailyEntries.reduce((sum, entry) => sum + entry.target, 0);
    const averageCalorieSurplus = totalCalories - totalTarget;
    const daysTracked = dailyEntries.length;

    return {
      totalDays: daysTracked,
      averageCalories: Math.round(totalCalories / daysTracked),
      averageCalorieSurplus: Math.round(averageCalorieSurplus / daysTracked),
      onTargetDays: dailyEntries.filter(entry => entry.status === 'Perfect').length,
      overTargetDays: dailyEntries.filter(entry => entry.status.includes('Over')).length,
      underTargetDays: dailyEntries.filter(entry => entry.status.includes('Under')).length
    };
  }
}

// Create and export a singleton instance
export const bmiTrackingService = new BMITrackingService(); 