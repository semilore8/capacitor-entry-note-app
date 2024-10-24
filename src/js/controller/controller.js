import addNoteView from "../view/addNoteView";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import * as Model from "../model/model";
import notesView from "../view/notesView";
import detailsView from "../view/detailsView";
import { App } from "@capacitor/app";

const deviceObject = {
  exitApp: true,
  currentView: undefined,
};

//b click exit app
// when new view is create exitapp trur

// Call the element loader before the render call
defineCustomElements(window);

const deviceNavigationController = function () {
  //back btn handler
  App.addListener(
    "backButton",
    function () {
      if (deviceObject.exitApp) return App.exitApp();
      deviceObject.currentView._hideView();
      deviceObject.exitApp = true;
    }.bind(this)
  );
};

//handle adding new note
const addNewNoteController = function () {
  //show add note view
  notesView.plusBtnClickHandler(
    addNoteView.showViewHandler.bind(addNoteView, deviceObject)
  );
};

//show all notes
const mainViewController = function () {
  try {
    notesView.appLoadedHandler(Model.getNoteData);
    //show  view notes  and notes details
    notesView.noteClickListener(noteClickHandlerController);
  } catch (e) {
    notesView._showMessage(e);
  }
};

//add note view controller
const addNoteViewController = async function () {
  try {
    //save notes
    addNoteView.saveBtnClickHandler(Model.saveNoteData);
  } catch (e) {
    addNoteView._showMessage(e);
  }
};

const noteClickHandlerController = async function (id) {
  try {
    detailsView.showNotesDetails(await Model.getNoteById(id), deviceObject);
  } catch (e) {
    detailsView._showMessage(e);
  }
};

const saveEditNoteController = function () {
  detailsView.saveBtnListener(Model.updateNoteById);
};

const deleteNoteController = function () {
  detailsView.deleteNoteListener(Model.deleteNote);
};

const init = function () {
  addNewNoteController();
  mainViewController();
  addNoteViewController();
  deleteNoteController();
  saveEditNoteController();
  deviceNavigationController();
};

//initialize the app
init();
