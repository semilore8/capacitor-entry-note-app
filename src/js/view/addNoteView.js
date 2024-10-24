import {
  escapeHtml,
  generateId,
  upperFistChar,
} from "../configandHelper/helper";
import notesView from "./notesView";
import View from "./view";

class AddNoteView extends View {
  _parentElement = document.querySelector(".add-note-view-con");

  #descriptionInputEl = document.querySelector(".add-note-input-description");
  #amountInputEl = document.querySelector(".add-note-input-amount");
  #typeInputEl = document.querySelector(".add-note-type");

  #messages = {
    error: "Input a valid description and amount!",
    success: "Note added",
  };

  #data = {};

  showViewHandler(deviceObject) {
    this._displayView();
    this.#descriptionInputEl.focus();
    this._backBtnHandler(deviceObject);
  }

  async validateNoteInputs(descEl, amountEl, errorMessage) {
    try {
      if (
        descEl.value.trim() === "" ||
        amountEl.value.trim() === "" ||
        amountEl.value.trim() < this._variables.zero
      ) {
        await this._showMessage(errorMessage);
        return false;
      }

      return true;
    } catch (e) {
      this._showMessage(e);
    }
  }

  generateNoteData(
    descEl,
    amountEl,
    type,
    id = generateId(),
    updateHistory = []
  ) {
    return {
      description: upperFistChar(escapeHtml(descEl.value)),
      amount: amountEl.value.trim(),
      type: type.value,
      timestamp: new Date().toISOString(),
      id: id,
      updateHistory,
    };
  }

  async saveAndValidateInput(handler) {
    try {
      //validate input
      if (
        !(await this.validateNoteInputs(
          this.#descriptionInputEl,
          this.#amountInputEl,
          this.#messages.error
        ))
      )
        return;

      //generate the notes data for storage
      this.#data = this.generateNoteData(
        this.#descriptionInputEl,
        this.#amountInputEl,
        this.#typeInputEl
      );

      handler(this.#data);

      //clear inputs fields
      this.#descriptionInputEl.value = this.#amountInputEl.value = "";

      //update the note view
      notesView.insertNewNote(this.#data);
      this._showMessage(this.#messages.success, true);
      this._hideView();
    } catch (e) {
      this._showMessage(e);
    }
  }

  saveBtnClickHandler(handler) {
    this._parentElement
      .querySelector(".save-note-btn")
      .addEventListener("click", this.saveAndValidateInput.bind(this, handler));
  }
}

export default new AddNoteView();
