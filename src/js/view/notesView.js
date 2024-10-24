import { deleteById, insertToElement } from "../configandHelper/helper";
import View from "./view";

class NotesView extends View {
  _parentElement = document.querySelector(".main-content");

  #debitConEl = document.querySelector(
    ".debit-notes-content-con .content-container"
  );
  #creditConEl = document.querySelector(
    ".credit-notes-content-con .content-container"
  );
  #creditEmptyNoteEl = this.#creditConEl.querySelector(".empty-note");
  #debitEmptyNoteEl = this.#debitConEl.querySelector(".empty-note");

  #data;
  #debitData;
  #creditData;

  #generateCreditAndDebitHtml(debitData, creditData) {
    const debitHtml = debitData.map((entry) =>
      this.#generateNoteListHTML(entry)
    );
    const creditHtml = creditData.map((entry) =>
      this.#generateNoteListHTML(entry)
    );

    return { debitHtml, creditHtml };
  }

  #hideLoaders() {
    [this.#debitEmptyNoteEl, this.#creditEmptyNoteEl].forEach((el) =>
      el.classList.add(this._variables.hideClass)
    );
  }

  #insertNoteList(html, element) {
    if (this.#generateEmptyNoteHtml(element, html)) return;

    insertToElement(element, this._variables.beforeEnd, html.join("\n"));
  }

  async appLoadedHandler(handler) {
    this.#data = await handler();

    //filter and generate the credit and debit note html
    this.#debitData = this.#data.filter(
      (entry) => entry.type === this._variables.debit
    );
    this.#creditData = this.#data.filter(
      (entry) => entry.type === this._variables.credit
    );

    const { debitHtml, creditHtml } = this.#generateCreditAndDebitHtml(
      this.#debitData,
      this.#creditData
    );

    //hide loader
    this.#hideLoaders();

    //render credit list to creditEl
    this.#insertNoteList(debitHtml, this.#debitConEl);
    //render debit list to debitEl
    this.#insertNoteList(creditHtml, this.#creditConEl);
  }

  noteClickListener(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const targetEl = e.target.closest(".notes-content-list");

      if (!targetEl) return;
      handler(targetEl.dataset.id);
    });
  }

  #hideEmptyNoteEl(element) {
    element
      .querySelector(".empty-note-text")
      ?.classList.add(this._variables.hideClass);
  }

  insertNewNote(data) {
    if (data.type === this._variables.debit) {
      insertToElement(
        this.#debitConEl,
        this._variables.beforeEnd,
        this.#generateNoteListHTML(data, true)
      );

      //push the new data to debit
      this.#debitData.push(data);

      this.#hideEmptyNoteEl(this.#debitConEl);
    } else {
      insertToElement(
        this.#creditConEl,
        this._variables.beforeEnd,
        this.#generateNoteListHTML(data, true)
      );

      //push the new data to credit
      this.#creditData.push(data);

      this.#hideEmptyNoteEl(this.#creditConEl);
    }

    // scroll to the element
    this.#getElementByDataset(data.id).scrollIntoView({
      behavior: "smooth",
    });
  }

  #getElementByDataset(dataset) {
    return this._parentElement.querySelector(
      `.notes-content-list[data-id='${dataset}']`
    );
  }

  deleteNoteInView(data) {
    this.#getElementByDataset(data.id).classList.add("delete-note");

    // del note from data;
    if (data.type === this._variables.debit)
      deleteById(this.#debitData, data.id);
    else deleteById(this.#creditData, data.id);

    if (data.type === this._variables.debit)
      this.#generateEmptyNoteHtml(this.#debitConEl, this.#debitData);
    else this.#generateEmptyNoteHtml(this.#creditConEl, this.#creditData);
  }

  #generateEmptyNoteHtml(element, data) {
    const html = `<article class="empty-note-text">No notes yet,
     click the + icon to add a new note</article>`;

    if (data.length === this._variables.zero) {
      insertToElement(element, this._variables.afterbegin, html);

      return true;
    }
    return false;
  }

  #generateNoteListHTML(
    { description, amount, type, timestamp, id },
    isNew = false
  ) {
    return `
    <article class="notes-content-list ${isNew ? "new-note" : ""} ${
      type === this._variables.debit
        ? "content-list-debit"
        : "content-list-credit"
    } content-list" data-id="${id}">
     <p class="content-date">1d</p>
     <p class="notes-content-title content-title">${description}</p>
     <p class="notes-content-amount content-amount">(₦)${amount}</p>
    </article>`;
  }
}

export default new NotesView();
