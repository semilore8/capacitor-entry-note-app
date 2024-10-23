import { insertToElement, upperFistChar } from "../configandHelper/helper";
import notesView from "./notesView";
import View from "./view";

class DetailsView extends View {
  _parentElement = document.querySelector(".details-note-view-con");

  #notesConEl = this._parentElement.querySelector(".details-note-view-content");
  #noDeleteBtnEl = document.querySelector(".delete-no-note-btn");
  #deleteBtn = this._parentElement.querySelector(".delete-note-btn");
  #yesDeleteBtn = this._parentElement.querySelector(".delete-yes-btn");
  #delOptConEl = this._parentElement.querySelector(
    ".details-note-confirmation-options"
  );
  #delParentConEl = this._parentElement.querySelector(".details-note-options");

  #successMessage = "Note deleted";
  #data = {};

  constructor() {
    super();
    this.#noDeleteHandler();
    this.#showConfirmationDialog();
  }

  showNotesDetails(data) {
    this.#data = data;
    //display the view
    this._displayView();

    //inserting the details into the view

    this.#notesConEl.innerHTML = "";
    insertToElement(
      this.#notesConEl,
      this._variables.afterbegin,
      this.#generateDetailsContent(this.#data)
    );
  }

  #showConfirmationDialog() {
    //show confirmation message
    this.#deleteBtn.addEventListener(
      "click",
      this.#toggleDelOptionCon.bind(this)
    );
  }

  deleteNoteListener(handler) {
    //delete the note
    this.#yesDeleteBtn.addEventListener(
      "click",
      this.#deleteNote.bind(this, handler)
    );
  }

  #deleteNote(handler) {
    handler(this.#data.id);
    this.#toggleDelOptionCon();
    this._hideView();

    //delete note from the ui
    notesView.deleteNoteInView(this.#data);

    this._showMessage(this.#successMessage, true);
  }

  #noDeleteHandler() {
    this.#noDeleteBtnEl.addEventListener(
      "click",
      this.#toggleDelOptionCon.bind(this)
    );
  }

  #toggleDelOptionCon() {
    this.#delParentConEl.classList.toggle("flex");
    this.#delOptConEl.classList.toggle(this._variables.hideClass);
  }

  #generateDetailsContent({
    description,
    amount,
    type,
    timestamp,
    updateTimeStamp,
  }) {
    return `  
          <input
            type="text"
            class="details-note-input-description input-underline"
            placeholder="Description"
            readonly="true"
            value = "${description}"
          />
          <input
            type="number"
            class="details-note-input-amount input-underline"
            placeholder="Amount"
            readonly="true"
            value = "${amount}"
          />

          <article class="details-type-date">
            <p class="details-note-type" aria-readonly="true">${upperFistChar(
              type
            )}</p>
           
            ${
              updateTimeStamp
                ? `
              <p class="details-note-date-update" aria-readonly="true">
              Updated on ${updateTimeStamp}
              </p>
            `
                : ""
            }
            
            <p class="details-note-date-created" aria-readonly="true">
              Created on ${timestamp}
            </p>
          </article>
    `;
  }
}

export default new DetailsView();
