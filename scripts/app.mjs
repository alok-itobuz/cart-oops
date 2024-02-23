import product from "../data/product.mjs";

class App {
  page = {
    HOME: "home",
    CART: "cart",
    WISHLIST: "wishlist",
    REGISTER: "register",
    LOGIN: "login",
  };
  keys = {
    OTP: "otp",
    USERS: "users",
    CURRENT_USER: "curr_user",
    WISHLIST: "wishlist",
    CART: "cart",
  };

  // universal variables
  users;
  currentUser;
  currentPage;

  constructor() {
    this._getUsers();
    this._getCurrentUser();
  }

  _setCurrentPage(page) {
    this.currentPage = page;
  }

  _getUsers() {
    this.users = this._getLocalStorage(this.keys.USERS);
  }

  _getCurrentUser() {
    this.currentUser = this._getLocalStorage(this.keys.CURRENT_USER);
  }

  _setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  _getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  _updatePage(page) {
    this.currentPage = page;
  }

  _createCustomisedElement(tagName, classNames, attributes, innerText) {
    const elem = document.createElement(tagName);
    if (classNames) elem.classList.add(...classNames);

    attributes?.forEach((att) => {
      elem.setAttribute(att[0], att[1]);
    });

    if (innerText) elem.innerText = innerText;

    return elem;
  }

  _redirect(path, message) {
    message && alert(message);
    location.href = `${location.origin}/pages/${path}`;
  }
}

export class AuthPages extends App {
  constructor() {
    super();
    if (this.currentUser) this._redirect("index.html", "");
    this.form = document.querySelector("#form");
    this.inputEmail = document.querySelector(".user-email");
    this.inputPassword = document.querySelector(".user-password");
  }

  _getInputValue() {
    return {
      email: this.inputEmail.value,
      password: this.inputPassword.value,
    };
  }

  _setFieldsEmpty() {
    this.inputEmail.value = "";
    this.inputPassword.value = "";
  }

  _onFormSubmit(e) {
    e.preventDefault();
  }
}

export class FeaturePages extends App {
  products;
  cart;
  wishlist;
  // DOM elements
  cardContainer;
  btnLogOut;
  email;

  constructor() {
    super();
    localStorage.removeItem(this.keys.OTP);

    if (!this.currentUser) {
      this._redirect("login.html", "You must login to see the cart items.");
    }

    this.email = this.currentUser.email;
    this._getProducts();
    this._getCartitems();
    this._getWishlistItems();

    // dom elements
    this.btnLogOut = document.querySelector(".btn-logout");
    this.cardContainer = document.querySelector(".card-container");
    this._updateCartItemCount();
    this._updateWishlistItemCount();
    document
      .querySelector(".card-container")
      .addEventListener("click", (e) => this._clickEventListener.bind(this)(e));
  }

  _getProducts() {
    this.products = product;
  }

  _getCartitems() {
    this.cart = this._getLocalStorage(this.keys.CART) || {};
    if (!this.cart[this.email]) this.cart[this.email] = [];
  }

  _getWishlistItems() {
    this.wishlist = this._getLocalStorage(this.keys.WISHLIST) || {};
    if (!this.wishlist[this.email]) this.wishlist[this.email] = [];
  }

  _updateCartItemCount() {
    document.querySelector(".cart-item-count").innerText = this.cart[this.email]
      ? this.cart[this.email].length
      : 0;
  }

  _updateWishlistItemCount() {
    document.querySelector(".wishlist-item-count").innerText = this.wishlist[
      this.email
    ]
      ? this.wishlist[this.email].length
      : 0;
  }

  _setLocalStorageAndUpdateCartItem(key, data) {
    this._setLocalStorage(key, data);
    this._updateCartItemCount();
  }

  _createCard(id, imagePath, imageAlt, price, title, count, isWishlisted) {
    const card = this._createCustomisedElement(
      "div",
      ["card"],
      [["data-id", id]],
      null
    );

    const imageContainer = this._createCustomisedElement(
      "div",
      ["image-container"],
      null,
      null
    );

    const cardImage = this._createCustomisedElement(
      "img",
      null,
      [
        ["src", imagePath],
        ["alt", imageAlt],
      ],
      null
    );
    imageContainer.appendChild(cardImage);

    const textContainer = this._createCustomisedElement(
      "div",
      ["text-container"],
      null,
      null
    );

    const titleHeading = this._createCustomisedElement("h3", null, null, title);
    const titleDescription = this._createCustomisedElement(
      "p",
      ["price"],
      null,
      `$ ${price}`
    );
    textContainer.append(titleHeading, titleDescription);

    if (this.currentPage === this.page.HOME) {
      const btnAddToCart = this._createCustomisedElement(
        "button",
        ["add-to-cart", `add-to-cart-${id}`, `display-${count ? "none" : ""}`],
        [
          ["data-id", id],
          ["data-btn-type", "add-to-cart"],
        ],
        "Add to Cart"
      );
      textContainer.append(btnAddToCart);
    }

    // card buttons
    if (this.currentPage !== this.page.WISHLIST) {
      const cardButtons = this._createCustomisedElement(
        "div",
        [
          "card-buttons",
          `card-buttons-${id}`,
          `display-${count ? "" : "none"}`,
        ],
        [["data-id", id]]
      );

      const addQuantityBtn = this._createCustomisedElement(
        "button",
        ["btn-change-quantity", "add-quantity"],
        [["data-id", id]],
        "+"
      );

      const itemCountText = this._createCustomisedElement(
        "p",
        ["item-count"],
        null,
        count
      );

      const removeQuantityBtn = this._createCustomisedElement(
        "button",
        ["btn-change-quantity", "remove-quantity"],
        [["data-id", id]],
        "-"
      );
      cardButtons.append(removeQuantityBtn, itemCountText, addQuantityBtn);
      textContainer.append(cardButtons);
    }

    if (this.currentPage !== this.page.CART) {
      const wishlistInput = this._createCustomisedElement(
        "input",
        ["input-wishlist"],
        [
          ["data-id", id],
          ["type", "checkbox"],
          ["value", id],
        ],
        null
      );
      isWishlisted && wishlistInput.setAttribute("checked", true);
      card.append(wishlistInput);
    }

    card.append(imageContainer, textContainer);

    return card;
  }

  _displayNoItem() {
    const noProduct = document.createElement("h1");
    noProduct.innerHTML =
      this.currentPage === this.page.HOME
        ? "Sorry, there is no products at this time<br /> So sorry for the incovenience."
        : "You have not added <br/> any item in the cart....<br/><br/>Please add some.";
    this.cardContainer.innerHTML = "";
    this.cardContainer.appendChild(noProduct);
  }

  _clickEventListener(e) {
    if (
      e.target.tagName.toLowerCase() !== "button" &&
      e.target.tagName.toLowerCase() !== "input"
    ) {
      return;
    }

    const clickedElement = e.target;
    const id = clickedElement.dataset.id;
    const clickedCard = [...document.querySelectorAll(".card")].find(
      (c) => c.dataset.id === id
    );

    const btnAddToCart = clickedCard.querySelector(".add-to-cart");
    const cardButtons = clickedCard.querySelector(".card-buttons");

    const displayProductQuantity = cardButtons?.querySelector(".item-count");

    // add to cart button clicked funtion
    const updateWishlist = (isChecked) => {
      if (!this.wishlist[this.email]) this.wishlist[this.email] = [];

      const wishlistProduct = this.products?.slice()?.find((p) => p.id == id);

      isChecked
        ? this.wishlist[this.email].push(wishlistProduct)
        : (this.wishlist[this.email] = this.wishlist[this.email].filter(
            (prod) => prod.id != id
          ));
      if (!isChecked && this.currentPage !== this.page.HOME)
        clickedCard.remove();
      this._setLocalStorage("wishlist", this.wishlist);
      this._updateWishlistItemCount();
    };

    const addToCartClicked = () => {
      if (!this.cart[this.email]) this.cart[this.email] = [];
      btnAddToCart.classList.add("display-none");
      cardButtons.classList.remove("display-none");

      const cartProduct = {
        product: this.products.slice().find((p) => p.id == id),
        count: 1,
      };
      this.cart[this.email].push(cartProduct);
      displayProductQuantity.innerHTML = 1;
      this._setLocalStorageAndUpdateCartItem("cart", this.cart);
    };

    const changeQuantityClicked = () => {
      const cartProduct = this.cart[this.email].find((c) => c.product.id == id);
      if (clickedElement.classList.contains("remove-quantity")) {
        cartProduct.count--;
        if (!cartProduct.count) {
          if (this.currentPage === this.page.HOME) {
            btnAddToCart.classList.remove("display-none");
            cardButtons.classList.add("display-none");
          } else {
            clickedCard.remove();
            if (this.cart[this.email].length === 1) {
              this._displayNoItem(this.cardContainer, this.currentPage);
            }
          }
        }
        this.cart[this.email] = this.cart[this.email].filter(
          (c) => c.count !== 0
        );
      } else {
        cartProduct.count++;
      }
      displayProductQuantity.innerText = cartProduct.count;
      this._setLocalStorageAndUpdateCartItem("cart", this.cart);

      if (this.currentPage === this.page.CART) {
        this._renderFooter();
      }
    };

    if (clickedElement.dataset.btnType === "add-to-cart") {
      addToCartClicked();
    } else if (clickedElement.tagName.toLowerCase() === "input") {
      const isChecked = clickedElement.checked;
      updateWishlist(isChecked);
    } else {
      changeQuantityClicked();
      if (this.currentPage === this.page.CART) {
        this._renderFooter(this.cart[this.email]);
      }
    }
  }
}
