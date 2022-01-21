if (window.process.env.testing && window.process.env.NODE_ENV !== "production") {
  import("./elements/pc-wallet-tests.js");
}
