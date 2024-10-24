import { insertToElement, upperFistChar } from "../configandHelper/helper";
import notesView from "./notesView";
import View from "./view";

class DetailsView extends View {
  _parentElement = document.querySelector(".details-note-view-con");

  #notesConEl = this._parentElement.querySelector(".details-note-view-content");
  #noDeleteBtnEl = document.querySelector(".delete-no-note-btn");
  #editBtn = this._parentElement.querySelector(".edit-note-btn");
  #editCancelBtn = this._parentElement.querySelector(".edit-cancel-note-btn");
  #deleteBtn = this._parentElement.querySelector(".delete-note-btn");
  #yesDeleteBtn = this._parentElement.querySelector(".delete-yes-btn");
  #delOptConEl = this._parentElement.querySelector(
    ".details-note-confirmation-options"
  );
  #editOptConEl = this._parentElement.querySelector(
    ".details-note-edit-options"
  );

  #optionsConEl = this._parentElement.querySelector(".details-note-options");

  #successMessage = "Note deleted";
  #data = {};

  constructor() {
    super();
    this.#noDeleteListener();
    this.#showConfirmationDialog();

    this.#editBtnListener();
    this.#cancelEditOptions();
  }

  showNotesDetails(data, deviceObject) {
    this.#data = data;
    //display the view
    this._displayView();
    this._backBtnHandler(deviceObject);
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

  #noDeleteListener() {
    this.#noDeleteBtnEl.addEventListener(
      "click",
      this.#toggleDelOptionCon.bind(this)
    );
  }

  //edit note
  #editBtnListener() {
    this.#editBtn.addEventListener(
      "click",
      this.#editBtnClickHandler.bind(this)
    );
  }

  #editBtnClickHandler() {
    const inputDescription = this._parentElement.querySelector(
      ".details-note-input-description"
    );
    const inputAmount = this._parentElement.querySelector(
      ".details-note-input-amount"
    );

    this.#toggleEditOptionCon();
    this.#toggleInputsActive(inputDescription, inputAmount);
  }

  #toggleInputsActive(descEl, amountEl, toggle = true) {
    if (toggle) {
      descEl.removeAttribute("readonly");
      amountEl.removeAttribute("readonly");
    } else {
      descEl.setAttribute("readonly", "");
      amountEl.setAttribute("readonly", "");
    }
  }

  #cancelEditOptions() {
    this.#editCancelBtn.addEventListener(
      "click",
      this.#toggleEditOptionCon.bind(this)
    );
  }

  #toggleDelOptionCon() {
    this.#optionsConEl.classList.toggle(this._variables.hideClass);
    this.#delOptConEl.classList.toggle(this._variables.hideClass);
  }
  #toggleEditOptionCon() {
    this.#optionsConEl.classList.toggle(this._variables.hideClass);
    this.#editOptConEl.classList.toggle(this._variables.hideClass);
  }
  _resetAllOptions() {
    //reset del options
    this.#optionsConEl.classList.remove(this._variables.hideClass);
    this.#delOptConEl.classList.add(this._variables.hideClass);

    this.#optionsConEl.classList.remove(this._variables.hideClass);
    this.#editOptConEl.classList.add(this._variables.hideClass);
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
