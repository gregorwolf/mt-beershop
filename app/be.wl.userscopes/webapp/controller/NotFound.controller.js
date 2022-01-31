sap.ui.define(["./BaseController"], function (__BaseController) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }

  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * @namespace be.wl.userscopes.controller
   */


  const NotFound = BaseController.extend("be.wl.userscopes.controller.NotFound", {
    onInit: function _onInit() {
      this.getRouter().getTarget("notFound").attachDisplay(() => this.onNotFoudnDisplayed());
    },
    onNotFoudnDisplayed: function _onNotFoudnDisplayed() {
      this.getModel("appView").setProperty("/layout", "OneColumn");
    }
  });
  return NotFound;
});
//# sourceMappingURL=NotFound.controller.js.map