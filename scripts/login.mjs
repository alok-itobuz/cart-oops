import { AuthPages } from "./app.mjs";

class Login extends AuthPages {
  constructor() {
    super();
    this.currentPage = this.page.LOGIN;
    this._setFieldsEmpty();
    this.form.addEventListener("submit", (e) =>
      this._onFormSubmit.bind(this)(e)
    );
  }

  _onFormSubmit(e) {
    super._onFormSubmit(e);
    const { email, password } = this._getInputValue();

    if (!email || !password) {
      alert(`email and password fields can't be left empty`);
      return;
    }

    const userExist = this._getLocalStorage(this.keys.USERS)[email];

    if (!userExist) {
      alert(`User doesn't exist!`);
      return;
    }

    if (password === userExist.password) {
      this._setLocalStorage(this.keys.CURRENT_USER, {
        name: userExist.name,
        email,
      });
      this._redirect("index.html", "");
    } else {
      alert(`email or password is invalid`);
    }
  }
}
new Login();
