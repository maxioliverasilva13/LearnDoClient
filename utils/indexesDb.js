const indexedDB =
  typeof window !== "undefined"
    ? window?.indexedDB ||
      window?.mozIndexedDB ||
      window?.webkitIndexedDB ||
      window?.msIndexedDB ||
      window?.shimIndexedDB
    : null;

if (!indexedDB) {
  console.log("IndexedDB could not be found in this browser.");
}
// 2

export const initializeDb = () => {
  if (indexedDB) {
    const request = indexedDB.open("ClasesGuardadas", 1);
    if (request) {
      console.log("siiii33");
      console.log(request.onsuccess);
    }
    console.log(request?.onsuccess);
    request.onsuccess = function (event) {
      request.onupgradeneeded = function () {
        console.log("aca 1");
        //1
        const db = request.result;

        //2
        const store = db.createObjectStore("cars", { keyPath: "id" });

        //3
        store.createIndex("cars_colour", ["colour"], { unique: false });

        // 4
        store.createIndex("colour_and_make", ["colour", "make"], {
          unique: false,
        });
      };
    };
  }
};

export function Database_Open() {
  let meDatabase;
  return new Promise(function (resolve, reject) {
    var dbReq = indexedDB.open("SavedClases", 1);
    dbReq.onupgradeneeded = function (event) {
      meDatabase = event.target.result;

      let clasesStore = meDatabase.createObjectStore("clases", {
        autoIncrement: true,
      });
      clasesStore.createIndex("id", "id", { unique: true });
      clasesStore.createIndex("nombre", "nombre", { unique: false });
      clasesStore.createIndex("video", "video", { unique: false });
      clasesStore.createIndex("cursoId", "cursoId", { unique: false });
      clasesStore.createIndex("cursoInfo", "cursoInfo", { unique: false });
      clasesStore.createIndex("moduloInfo", "moduloInfo", { unique: false });
      clasesStore.createIndex("type", "type", { unique: false });

      resolve(dbReq);
    };
    dbReq.onsuccess = function (event) {
      meDatabase = event.target.result;
      let x = 1;
      resolve(dbReq);
    };
    dbReq.onerror = function (event) {
      reject("error opening database " + event.target.errorCode);
    };
  });
}

export const storeItemOnIndexes = async (item) => {
  var dbReq = indexedDB.open("SavedClases", 1);
  dbReq.onsuccess = function (event) {
    let meDatabase = event.target.result;
    const transaction = meDatabase.transaction("clases", "readwrite");
    const clases = transaction.objectStore("clases");
    console.log("item to create", item);
    clases?.put({
      id: item?.id,
      nombre: item?.nombre,
      video: item?.video,
      cursoId: item?.cursoId,
      cursoInfo: item?.cursoInfo,
      moduloInfo: item?.moduloInfo,
      type: item?.type,
    });
  };
};

export const loadSavedClases = async (item) => {
  return new Promise(async (resolve, reject) => {
    try {
      var dbReq = indexedDB.open("SavedClases", 1);
      dbReq.onsuccess = async function (event) {
        let meDatabase = event.target.result;
        const transaction = meDatabase.transaction("clases", "readwrite");
        const clases = transaction.objectStore("clases");
        const items = await clases?.getAll();
        items.onsuccess = function (event) {
          resolve(event?.target?.result);
        };
        items.onerror = function () {
          resolve([]);
        };
      };
    } catch (error) {
      reject(error);
    }
  });
};

export const get_url_extension = (url, type) => {
  const fileExtension = url.split(/[#?]/)[0].split(".").pop().trim();
  return `${type}/${fileExtension}`;
};

export const removeItemFromDB = async (item, onSuccess) => {
  var dbReq = indexedDB.open("SavedClases", 1);
  dbReq.onsuccess = function (event) {
    let meDatabase = event.target.result;
    const transaction = meDatabase.transaction("clases", "readwrite");
    const clases = transaction.objectStore("clases");
    var index = clases.index("id");
    var request = index.openCursor(IDBKeyRange.only(item?.id));
    request.onsuccess = function () {
      var cursor = request.result;
      if (onSuccess) {
        onSuccess();
      }
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
  };
};
