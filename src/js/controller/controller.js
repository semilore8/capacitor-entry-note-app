import addNoteView from "../view/addNoteView";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import * as Model from "../model/model";
import notesView from "../view/notesView";
import detailsView from "../view/detailsView";

// Call the element loader before the render call
defineCustomElements(window);

//show all notes
const mainViewController = function () {
  try {
    notesView.appLoadedHandler(Model.getNoteData);
    notesView.backNavBtnHandler();

    //show  view notes  and notes details
    notesView.noteClickListener(noteClickHandlerController);
  } catch (e) {
    notesView._showMessage();
  }
};

const noteClickHandlerController = async function (id) {
  try {
    detailsView.showNotesDetails(await Model.getNoteById(id));
  } catch (e) {
    detailsView._showMessage();
  }
};

const deleteNoteController = function () {
  detailsView.deleteNoteListener(Model.deleteNote);
};

//add note view controller
const addNoteViewController = async function () {
  try {
    //show add note view
    addNoteView.showView();
    //save notes
    addNoteView.saveBtnClickHandler(Model.saveNoteData);
    //back button navigation
    addNoteView.backNavBtnHandler();
  } catch (e) {
    addNoteView._showMessage(e);
  }
};

const init = function () {
  mainViewController();
  addNoteViewController();
  deleteNoteController();
};

//initialize the app
init();
