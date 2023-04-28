using {
  cuid,
  managed
} from '@sap/cds/common';

namespace my.beershop;

entity Beers : cuid, managed {
  title : String  @(title: '{i18n>title}', );
  stock : Integer @(title: '{i18n>stock}', );
}

@cds.persistence.exists
entity CS1TAB {
  key SalesOrderId : String(10) not null;
      ProductId    : String(10) not null;
      Quantity     : Integer;
      DeliveryDate : Date;
}
