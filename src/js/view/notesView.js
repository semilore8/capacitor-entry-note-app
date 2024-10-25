import {
  deleteById,
  insertToElement,
  timeAgo,
} from "../configandHelper/helper";
import View from "./view";

class NotesView extends View {
  _parentElement = document.querySelector(".main-content");

  #addNoteBtn = document.querySelector(".add-note-btn");

  #debitConEl = document.querySelector(
    ".debit-notes-content-con .content-container"
  );
  #creditConEl = document.querySelector(
    ".credit-notes-content-con .content-container"
  );
  #creditEmptyNoteEl = this.#creditConEl.querySelector(".empty-note");
  #debitEmptyNoteEl = this.#debitConEl.querySelector(".empty-note");

  #expandDebitBtn = document.querySelector(".expand-debit-icon");
  #expandCreditBtn = document.querySelector(".expand-credit-icon");

  #debitTotalEl = document.querySelector(".total-debit-out");
  #creditTotalEl = document.querySelector(".total-credit-out");

  #data;
  #debitData;
  #creditData;
  #totalSumData;

  constructor() {
    super();
    this.#expandBtnListener();
  }
  plusBtnClickHandler(handler) {
    this.#addNoteBtn.addEventListener("click", handler);
  }
  #expandBtnListener() {
    this.#expandDebitBtn.addEventListener(
      "click",
      this.#expandNotesCon.bind(this, this.#debitConEl, this.#expandDebitBtn)
    );
    this.#expandCreditBtn.addEventListener(
      "click",
      this.#expandNotesCon.bind(this, this.#creditConEl, this.#expandCreditBtn)
    );
  }

  #expandNotesCon(conEl, expandBtn) {
    conEl.classList.toggle(this._variables.hideClass);
    expandBtn.classList.toggle("rotate-180");

    conEl.parentElement
      .querySelector(".expand-help")
      .classList.toggle(this._variables.hideClass);
  }

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

  #updateTotalEl({ totalDebit, totalCredit }) {
    if (totalDebit === 0)
      this.#debitTotalEl.parentElement.classList.add(this._variables.hideClass);
    else {
      this.#debitTotalEl.textContent = totalDebit.toFixed(2);
      this.#debitTotalEl.parentElement.classList.remove(
        this._variables.hideClass
      );
    }

    if (totalCredit === 0)
      this.#creditTotalEl.parentElement.classList.add(
        this._variables.hideClass
      );
    else {
      this.#creditTotalEl.textContent = totalCredit.toFixed(2);
      this.#creditTotalEl.parentElement.classList.remove(
        this._variables.hideClass
      );
    }
  }

  async appLoadedHandler(totalSumDataHandler, handler) {
    this.#data = await handler();
    this.#totalSumData = await totalSumDataHandler();

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

    //render the debit and credit total
    this.#updateTotalEl(this.#totalSumData);
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

      //show the total amount
      this.#totalSumData.totalDebit += +data.amount;

      this.#updateTotalEl(this.#totalSumData);

      this.#hideEmptyNoteEl(this.#debitConEl);
    } else {
      insertToElement(
        this.#creditConEl,
        this._variables.beforeEnd,
        this.#generateNoteListHTML(data, true)
      );

      //push the new data to credit
      this.#creditData.push(data);

      //show the total amount
      this.#totalSumData.totalCredit += +data.amount;
      this.#updateTotalEl(this.#totalSumData);

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
    if (data.type === this._variables.debit) {
      deleteById(this.#debitData, data.id);
      this.#generateEmptyNoteHtml(this.#debitConEl, this.#debitData);

      this.#totalSumData.totalDebit -= +data.amount;
      return this.#updateTotalEl(this.#totalSumData);
    }

    deleteById(this.#creditData, data.id);
    this.#generateEmptyNoteHtml(this.#creditConEl, this.#creditData);

    this.#totalSumData.totalCredit -= +data.amount;
    this.#updateTotalEl(this.#totalSumData);
  }

  updateNoteInViw(data, totalSumData) {
    const updateListEl = this.#getElementByDataset(data.id);

    updateListEl.classList.add("update-note");

    updateListEl.querySelector(".content-title").textContent = data.description;
    updateListEl.querySelector(".content-amount").textContent = data.amount;

    //update the total sum in view
    this.#totalSumData = totalSumData;
    this.#updateTotalEl(totalSumData);
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
     <p class="content-date">${timeAgo(timestamp)}</p>
     <p class="notes-content-title content-title ellipse">${description}</p>
     <p class="notes-content-amount content-amount ellipse">(₦)${amount}</p>
    </article>`;
  }
}

export default new NotesView();
