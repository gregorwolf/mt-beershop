sap.ui.define(["./BaseController", "sap/ui/Device", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/model/Sorter"], function (__BaseController, sap_ui_Device, Filter, FilterOperator, Sorter) {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }

  const BaseController = _interopRequireDefault(__BaseController);

  const system = sap_ui_Device["system"];

  /**
   * @namespace be.wl.userscopes.controller
   */
  const Master = BaseController.extend("be.wl.userscopes.controller.Master", {
    constructor: function constructor() {
      BaseController.prototype.constructor.apply(this, arguments);
      this.descendingSort = false;
    },
    onMasterMatched: function _onMasterMatched() {
      this.getModel("appView").setProperty("/layout", "OneColumn");
    },
    onListItemPress: async function _onListItemPress(event) {
      const replace = !system.phone,
            id = event.getSource().getBindingContext().getProperty("username"),
            helper = await this.getOwnerComponent().getHelper(),
            nextUIState = helper.getNextUIState(1);
      this.getRouter().navTo("detail", {
        id: id,
        layout: nextUIState.layout
      }, {}, replace);
    },
    onSearch: function _onSearch(event) {
      const query = event.getParameter("query");
      let tableSearchState = [];

      if (query && query.length > 0) {
        tableSearchState = [new Filter("Name", FilterOperator.Contains, query)];
      }

      this.getView().byId("productsTable").getBinding("items").filter(tableSearchState, "Application");
    },
    onSort: function _onSort(event) {
      this.descendingSort = !this.descendingSort;
      const view = this.getView(),
            table = view.byId("productsTable"),
            binding = table.getBinding("items"),
            sorter = new Sorter("Name", this.descendingSort);
      binding.sort(sorter);
    }
  });
  return Master;
});
//# sourceMappingURL=Master.controller.js.map