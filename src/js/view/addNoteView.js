import { upperFistChar } from "../configandHelper/helper";
import notesView from "./notesView";
import View from "./view";

class AddNoteView extends View {
  _parentElement = document.querySelector(".add-note-view-con");

  #addNoteBtn = document.querySelector(".add-note-btn");
  #descriptionInputEl = document.querySelector(".add-note-input-description");
  #amountInputEl = document.querySelector(".add-note-input-amount");
  #typeInputEl = document.querySelector(".add-note-type");

  #messages = {
    error: "Input a description and amount!",
    success: "Note added successfully!",
  };

  #data = {};

  showView() {
    this.#addNoteBtn.addEventListener("click", this._displayView.bind(this));
  }

  async saveAndValidateInput(handler) {
    try {
      //validate input
      if (
        this.#descriptionInputEl.value.trim() === "" ||
        this.#amountInputEl.value.trim() === "" ||
        this.#amountInputEl.value.trim() < this._variables.zero
      )
        return await this._showMessage(this.#messages.error);

      //generate the notes data for storage
      this.#data = {
        description: upperFistChar(this.#descriptionInputEl.value),
        amount: this.#amountInputEl.value.trim(),
        type: this.#typeInputEl.value,
        timestamp: new Date().toISOString(),
        id: Date.now(),
        updateTimestamp: undefined,
      };

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
