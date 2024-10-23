import { NOTES_DB_KEY } from "../configandHelper/config";
import { deleteById } from "../configandHelper/helper";
import * as databaseModel from "./dbModel";

//get all data
export const getNoteData = async function () {
  try {
    const notesData = await databaseModel.getDb(NOTES_DB_KEY);
    return notesData;
  } catch (e) {
    throw new Error(e);
  }
};

//find data by id
export const getNoteById = async function (id) {
  try {
    const notesData = await databaseModel.getDb(NOTES_DB_KEY);
    return notesData.find((entry) => entry.id === +id);
  } catch (error) {
    throw new Error(error);
  }
};

//save data to storage
export const saveNoteData = async function (data) {
  try {
    const existingData = await getNoteData();
    existingData.push(data);

    await databaseModel.setDb(NOTES_DB_KEY, JSON.stringify(existingData));
  } catch (e) {
    throw new Error(e);
  }
};

//delete existing data by id
export const deleteNote = async function (id) {
  try {
    //get all notes
    const allNotes = await getNoteData();

    //delete the notes
    deleteById(allNotes, id);
    //save notes
    databaseModel.setDb(NOTES_DB_KEY, JSON.stringify(allNotes));
  } catch (e) {
    throw new Error(e);
  }
};
