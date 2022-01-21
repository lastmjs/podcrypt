class Store {
  constructor(dbName = "keyval-store", storeName = "keyval") {
    this.storeName = storeName;
    this._dbp = new Promise((resolve, reject) => {
      const openreq = indexedDB.open(dbName, 1);
      openreq.onerror = () => reject(openreq.error);
      openreq.onsuccess = () => resolve(openreq.result);
      openreq.onupgradeneeded = () => {
        openreq.result.createObjectStore(storeName);
      };
    });
  }
  _withIDBStore(type, callback) {
    return this._dbp.then((db) => new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, type);
      transaction.oncomplete = () => resolve();
      transaction.onabort = transaction.onerror = () => reject(transaction.error);
      callback(transaction.objectStore(this.storeName));
    }));
  }
}
let store;
function getDefaultStore() {
  if (!store)
    store = new Store();
  return store;
}
function get(key, store2 = getDefaultStore()) {
  let req;
  return store2._withIDBStore("readonly", (store3) => {
    req = store3.get(key);
  }).then(() => req.result);
}
function set(key, value, store2 = getDefaultStore()) {
  return store2._withIDBStore("readwrite", (store3) => {
    store3.put(value, key);
  });
}
function del(key, store2 = getDefaultStore()) {
  return store2._withIDBStore("readwrite", (store3) => {
    store3.delete(key);
  });
}

export { del, get, set };
