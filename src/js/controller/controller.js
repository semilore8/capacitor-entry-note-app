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

const noteClickHandlerController = async function (id) {
  try {
    detailsView.showNotesDetails(await Model.getNoteById(id), deviceObject);
  } catch (e) {
    detailsView._showMessage(e);
  }
};

const deleteNoteController = function () {
  detailsView.deleteNoteListener(Model.deleteNote);
};

//add note view controller
const addNoteViewController = async function () {
  try {
    //show add note view
    addNoteView.showView(deviceObject);
    //save notes
    addNoteView.saveBtnClickHandler(Model.saveNoteData);
  } catch (e) {
    addNoteView._showMessage(e);
  }
};

const init = function () {
  mainViewController();
  addNoteViewController();
  deleteNoteController();
  deviceNavigationController();
};

//initialize the app
init();
