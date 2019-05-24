import { 
    get,
    set
} from 'idb-keyval';

export const IDBProxy = new Proxy({}, {
    get: async (obj, prop) => {
        return await get(prop);
    },
    set: async (obj, prop, value) => {
        set(prop, value);
        return true;
    }
});

(async () => {
    const setResult = IDBProxy.hello = 100;
    const getResult = await IDBProxy.hello;
    console.log('getResult', getResult);

})();


// console.log('setResult', setResult)

// setTimeout(async () => {
//     console.log(await IDBProxy.hello);
// }, 5000);