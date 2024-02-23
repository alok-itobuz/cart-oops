import { AuthPages } from "./app.mjs";

class Register extends AuthPages {
  otp;
  constructor() {
    super();
    emailjs.init({
      publicKey: "ncD_lPd3l5AXg9fSl",
    });
    this.currentPage = this.page.REGISTER;
    this.otp = this._getLocalStorage(this.keys.OTP);
    this.inputName = document.querySelector(".user-name");
    this.inputOtp = document.querySelector(".user-otp");

    document
      .querySelector(".btn-get-otp")
      .addEventListener("click", (e) => this._onGetOTPClicked.bind(this)(e));

    this.form.addEventListener("submit", (e) =>
      this._onFormSubmit.bind(this)(e)
    );
  }

  _setFieldsEmpty() {
    super._setFieldsEmpty();
    this.inputName.value = "";
    this.inputOtp.value = "";
  }

  _getInputValue() {
    return {
      ...super._getInputValue(),
      name: this.inputName.value,
      enteredOtp: this.inputOtp.value,
    };
  }

  _generateOtp() {
    const storedOtp = this._getLocalStorage(this.keys.OTP);
    if (storedOtp) {
      this.otp = storedOtp;
    } else {
      this.otp = "";
      for (let i = 1; i <= 6; i++) {
        this.otp += Math.trunc(Math.random() * 9) + 1;
      }
      console.log(this.otp);
      this._setLocalStorage(this.keys.OTP, this.otp);
    }
  }

  async _sendOtp() {
    this._generateOtp();
    const emailParams = {
      from_name: this.inputName.value,
      to_email: this.inputEmail.value,
      message: this.otp,
    };

    try {
      const res = await emailjs.send(
        "service_udd6kie",
        "template_n0o6o2q",
        emailParams
      );
      console.log(res);
    } catch (error) {
      console.log("error", err);
    }
  }

  _validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const isEmailValid = emailRegex.test(email);

    return isEmailValid;
  }

  _validatePassword(password) {
    // minimum 8 letters, 1 letter, 1 number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const isPasswordValid = passwordRegex.test(password);

    return isPasswordValid;
  }

  _onGetOTPClicked(e) {
    e.preventDefault();

    const { name, email, password } = this._getInputValue();

    if (!name || !email || !password) {
      alert(`Name, Email and password field shouldn't be empty`);
      return;
    }

    const isEmailValid = this._validateEmail(email);
    if (!isEmailValid) {
      alert("Enter a valid email address.");
      return;
    }

    const isPasswordValid = this._validatePassword(password);
    if (!isPasswordValid) {
      alert(
        "password must contains atlease 8 characters containg atleast a number and a letter."
      );
      return;
    }

    const usersData = this._getLocalStorage(this.keys.USERS);
    if (usersData && usersData[email]) {
      alert("user already exist");
      localStorage.removeItem(this.keys.OTP);
      this._setFieldsEmpty();
    } else {
      this._sendOtp();
    }
  }

  _onFormSubmit(e) {
    super._onFormSubmit(e);
    console.log("helllo");

    const { name, email, password, enteredOtp } = this._getInputValue();

    if (!name || !email || !password || !enteredOtp) {
      alert(`Name, Email, password and otp field shouldn't be empty`);
    } else {
      if (enteredOtp.toString() !== this.otp) {
        alert("Incorrect OTP");
      } else {
        let usersData = this._getLocalStorage(this.keys.USERS);
        console.log(usersData);
        usersData = { ...usersData, [email]: { name, password } };
        this._setLocalStorage(this.keys.USERS, usersData);
        this._setLocalStorage(this.keys.CURRENT_USER, { name, email });
        this._redirect("index.html", "");
      }
      localStorage.removeItem(this.keys.OTP);
    }
  }
}

new Register();
