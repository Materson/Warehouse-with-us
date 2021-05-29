export const DBconfig = {
  name: 'warehouse_with_us',
  version: 10,
  objectStoresMeta: [
    {
      store: 'products',
      storeConfig: { keyPath: 'id', autoIncrement:true},
      storeSchema: [
        { name: 'manufacturer', keypath: 'manufacturer', options: { unique: false } },
        { name: 'model', keypath: 'model', options: { unique: false } },
        { name: 'price', keypath: 'price', options: { unique: false } },
        { name: 'quantity', keypath: 'quantity', options: { unique: false } },
        { name: 'category', keypath: 'category', options: { unique: false } }
      ]
    },
    {
      store: 'operations',
      storeConfig: { keyPath: 'id', autoIncrement:false},
      storeSchema: [
        { name: 'edited', keypath: 'edited', options: { unique: false } },
        { name: 'moved', keypath: 'moved', options: { unique: false } },
        { name: 'deleted', keypath: 'deleted', options: { unique: false } },
        { name: 'added', keypath: 'added', options: { unique: false } }
      ]
    },
    {
      store: 'categories',
      storeConfig: { keyPath: 'id', autoIncrement:true},
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } }
      ]
    },
    {
      store: 'categoryOperations',
      storeConfig: { keyPath: 'id', autoIncrement:false},
      storeSchema: [
        { name: 'edited', keypath: 'edited', options: { unique: false } },
        { name: 'deleted', keypath: 'deleted', options: { unique: false } },
        { name: 'added', keypath: 'added', options: { unique: false } }
      ]
    }
  ]
};