import { Preferences } from "@capacitor/preferences";

const setDb = async (dbKey, data) => {
  await Preferences.set({
    key: dbKey,
    value: data,
  });
};

const getDb = async (dbKey) => {
  const { value } = await Preferences.get({ key: dbKey });
  return JSON.parse(value || "[]");
};

const removeDb = async (dbKey) => await Preferences.remove({ key: dbKey });

export { setDb, getDb, removeDb };
