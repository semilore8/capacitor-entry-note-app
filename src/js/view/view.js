import { App } from "@capacitor/app";
import { Toast } from "@capacitor/toast";
class View {
  _overlayEl = document.querySelector(".overlay");
  #htmlElement = document.querySelector("html");

  _variables = {
    zero: 0,
    beforeEnd: "beforeend",
    afterbegin: "afterbegin",
    hideClass: "hide",
    debit: "debit",
    credit: "credit",
    noScroll: "no-scroll",
  };

  #defaultMessage = "An error occurred";

  _showOverlay() {
    this._overlayEl.classList.remove(this._variables.hideClass);
    this.#htmlElement.classList.add(this._variables.noScroll);
  }
  _hideOverlay() {
    this._overlayEl.classList.add(this._variables.hideClass);
    this.#htmlElement.classList.remove(this._variables.noScroll);
  }

  //display current view
  _displayView() {
    this._showOverlay();
    this._parentElement.classList.remove(this._variables.hideClass);

    //cancel btn click handler
    this.#cancelBtnListener();
  }
  //hide view
  _hideView() {
    this._hideOverlay();
    this._parentElement.classList.add(this._variables.hideClass);

    this._resetAllOptions?.();
  }

  _backBtnHandler(deviceObj) {
    deviceObj.exitApp = false;
    deviceObj.currentView = this;
  }

  #cancelBtnListener() {
    [
      this._overlayEl,
      this._parentElement.querySelector(".cancelPopupBtn"),
    ].forEach((el) => el.addEventListener("click", this._hideView.bind(this)));
  }

  async _showMessage(message = this.#defaultMessage, type = false) {
    await Toast.show({
      text: (type === false ? "❌ " : "") + message,
      duration: "long",
      position: "bottom",
    });
  }
}

export default View;
