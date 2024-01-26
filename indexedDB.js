const form = document.querySelector("#upload");
form.addEventListener("submit", save);

// Form submit event
function save(e) {
    e.preventDefault();
    console.log(e.target[0].files[0]);
    const obj = {
        image: e.target[0].files[0],
        coords: "42.1222, 45.256"
    }

    saveToIndexedDB(obj, "test");
}

/**
 * Függvény amely, a mentést végzi az indexedDB
 * @param {object} data     JSON amit elment az indexedDB-be
 * @param {string} dbName   Az indexedDB adatbázis neve amit
 */
function saveToIndexedDB(data, dbName) {
    const req = window.indexedDB.open(dbName, 3);

    req.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
    }

    // Csatlakozás után ha a db nem létezi létre hozza
    req.onupgradeneeded = (event) => {
        console.log(`Database upgraded successfully: ${event.target.result}`)
        db = event.target.result;
        // datastore létrehozása autoIncrement-el
        db.createObjectStore(dbName, { autoIncrement: true });
    }

    // Amennyiben sikeres volt a csatlakozás és létezik a db felveiszi az adatokat
    req.onsuccess = (event) => {
        console.log(`Database opened successfully: ${event.target.result}`)
        db = event.target.result;

        // Olvasás, írásra nyitás
        const transaction = db.transaction([dbName], "readwrite");

        transaction.oncomplete = (event) => {
            console.log("All done!");
        };

        // Az adat mentése
        const objectStore = transaction.objectStore(dbName);
        objectStore.add(data);
    }
}