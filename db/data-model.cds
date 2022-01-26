using {
  cuid,
  managed
} from '@sap/cds/common';

namespace my.beershop;

entity Beers : cuid, managed {
  title : String  @(title : '{i18n>title}', );
  stock : Integer @(title : '{i18n>stock}', );
}
