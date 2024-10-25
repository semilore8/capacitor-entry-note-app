import {
  escapeHtml,
  insertToElement,
  timeAgo,
  upperFistChar,
} from "../configandHelper/helper";
import addNoteView from "./addNoteView";
import notesView from "./notesView";
import View from "./view";

class DetailsView extends View {
  _parentElement = document.querySelector(".details-note-view-con");

  #notesConEl = this._parentElement.querySelector(".details-note-view-content");
  #noDeleteBtnEl = document.querySelector(".delete-no-note-btn");
  #editBtn = this._parentElement.querySelector(".edit-note-btn");
  #saveEditBtn = this._parentElement.querySelector(".edit-save-btn");
  #editCancelBtn = this._parentElement.querySelector(".edit-cancel-note-btn");
  #deleteBtn = this._parentElement.querySelector(".delete-note-btn");
  #yesDeleteBtn = this._parentElement.querySelector(".delete-yes-btn");
  #delOptConEl = this._parentElement.querySelector(
    ".details-note-confirmation-options"
  );
  #editOptConEl = this._parentElement.querySelector(
    ".details-note-edit-options"
  );

  #editInputDescEl;
  #editInputAmountEl;

  #optionsConEl = this._parentElement.querySelector(".details-note-options");

  #messages = {
    delete: "Note deleted",
    edit: "Note edited successfully",
    invalid: "Input a valid description and amount!",
    error: "An error occurred",
  };
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

    this._showMessage(this.#messages.delete, true);
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
    this.#editInputDescEl = this._parentElement.querySelector(
      ".details-note-input-description"
    );
    this.#editInputAmountEl = this._parentElement.querySelector(
      ".details-note-input-amount"
    );
    this.#toggleEditOptionCon();
    this.#toggleInputsActive();
  }

  #toggleInputsActive(active = true) {
    if (active) {
      this.#editInputAmountEl.focus();
      this.#editInputDescEl.removeAttribute("readonly");
      this.#editInputAmountEl.removeAttribute("readonly");
    } else {
      this.#editInputDescEl.value = this.#data.description;
      this.#editInputAmountEl.value = this.#data.amount;

      this.#editInputDescEl.setAttribute("readonly", "");
      this.#editInputAmountEl.setAttribute("readonly", "");
    }
  }

  #cancelEditOptions() {
    this.#editCancelBtn.addEventListener(
      "click",
      function () {
        this.#toggleInputsActive(false);
        this.#toggleEditOptionCon();
      }.bind(this)
    );
  }

  //save the edited note
  saveBtnListener(handler) {
    this.#saveEditBtn.addEventListener(
      "click",
      this.#validateAndSaveEdits.bind(this, handler)
    );
  }

  async #validateAndSaveEdits(handler) {
    try {
      if (
        !(await addNoteView.validateNoteInputs(
          this.#editInputDescEl,
          this.#editInputAmountEl,
          this.#messages.invalid
        ))
      )
        return;

      this.#data.updateHistory.push({
        description: upperFistChar(escapeHtml(this.#editInputDescEl.value)),
        amount: this.#editInputAmountEl.value.trim(),
        timestamp: new Date().toISOString(),
      });

      const editObj = {
        description: upperFistChar(escapeHtml(this.#editInputDescEl.value)),
        amount: this.#editInputAmountEl.value.trim(),
        id: this.#data.id,
        updateHistory: this.#data.updateHistory,
      };

      const totalSumData = await handler(editObj);

      this._resetAllOptions();

      notesView.updateNoteInViw(editObj, totalSumData);

      this._hideView();
    } catch (e) {
      this._showMessage(this.#messages.error);
    }
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

  #generateUpdateHistoryHtml(updateArr) {
    return updateArr
      .map(
        (update) =>
          `<li>${update.description} | ₦${update.amount} | (${timeAgo(
            update.timestamp
          )}) ${timeAgo(update.timestamp, true)}</li>`
      )
      .reverse()
      .join("\n");
  }

  #generateDetailsContent({
    description,
    amount,
    type,
    timestamp,
    updateHistory,
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

            <p class="details-note-date-created" aria-readonly="true">
              Created in ${timeAgo(timestamp)} (${timeAgo(timestamp, true)})
            </p>

            ${
              updateHistory.length !== this._variables.zero
                ? `
                <ul class="details-note-date-update">
                  <li class='update-history-labal'>Update History </li>
                  ${this.#generateUpdateHistoryHtml(updateHistory)}
               </ul>
            `
                : ""
            }
            
          
          </article>
    `;
  }
}

export default new DetailsView();
