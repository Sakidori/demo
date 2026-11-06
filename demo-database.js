function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function createSnapshot(value) {
    return {
        exists: () => value !== undefined,
        val: () => clone(value)
    };
}

function pathParts(path) {
    return String(path || "").split("/").filter(Boolean);
}

function getAtPath(root, path) {
    return pathParts(path).reduce((value, part) => value?.[part], root);
}

function setAtPath(root, path, value) {
    const parts = pathParts(path);
    if (!parts.length) return value === null ? {} : clone(value);

    let parent = root;
    for (const part of parts.slice(0, -1)) {
        if (!parent[part] || typeof parent[part] !== "object") parent[part] = {};
        parent = parent[part];
    }

    const finalPart = parts.at(-1);
    if (value === null) delete parent[finalPart];
    else parent[finalPart] = clone(value);
    return root;
}

export function getDatabase() {
    return {
        value: {},
        listeners: new Set()
    };
}

export function ref(database, path = "") {
    return { database, path: pathParts(path).join("/") };
}

function notify(database, changedPath) {
    for (const listener of database.listeners) {
        const isRelated = !listener.path
            || !changedPath
            || listener.path === changedPath
            || listener.path.startsWith(`${changedPath}/`)
            || changedPath.startsWith(`${listener.path}/`);
        if (!isRelated) continue;
        queueMicrotask(() => listener.callback(createSnapshot(getAtPath(database.value, listener.path))));
    }
}

export async function set(reference, value) {
    reference.database.value = setAtPath(reference.database.value, reference.path, value);
    notify(reference.database, reference.path);
}

export function onValue(reference, callback) {
    const listener = { path: reference.path, callback };
    reference.database.listeners.add(listener);
    queueMicrotask(() => callback(createSnapshot(getAtPath(reference.database.value, reference.path))));
    return () => reference.database.listeners.delete(listener);
}

export function update(reference, values) {
    if (!values || typeof values !== "object" || Array.isArray(values)) {
        return Promise.reject(new TypeError("Demo database updates must be an object."));
    }
    for (const [path, value] of Object.entries(values)) {
        const fullPath = [reference.path, path].filter(Boolean).join("/");
        reference.database.value = setAtPath(reference.database.value, fullPath, value);
    }
    notify(reference.database, reference.path);
    return Promise.resolve();
}

export async function get(reference) {
    return createSnapshot(getAtPath(reference.database.value, reference.path));
}

export async function runTransaction(reference, updateFunction) {
    const currentValue = clone(getAtPath(reference.database.value, reference.path));
    const nextValue = updateFunction(currentValue);
    if (nextValue === undefined) {
        return {
            committed: false,
            snapshot: createSnapshot(currentValue)
        };
    }
    reference.database.value = setAtPath(reference.database.value, reference.path, nextValue);
    notify(reference.database, reference.path);
    return {
        committed: true,
        snapshot: createSnapshot(nextValue)
    };
}
