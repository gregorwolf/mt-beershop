/* checksum : 0e39772f33ac4ed2a71e6cfdc217e205 */
@cds.external : true
service EPM_REF_APPS_PROD_MAN_SRV {};

@cds.persistence.skip : true
@sap.content.version : '1'
entity EPM_REF_APPS_PROD_MAN_SRV.Suppliers {
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  key Id : String(10);
  @m.FC_TargetPath : 'SyndicationTitle'
  @m.FC_KeepInContent : 'true'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  Name : String(80);
  @sap.label : 'Telefon'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'tel;type=pref'
  Phone : String(30);
  @sap.label : 'E-Mail'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'email;type=pref'
  Email : String(255);
  @sap.label : 'URI'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'url;type=work'
  WebAddress : LargeString;
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  FormattedAddress : String(129);
  @sap.label : 'Name Ansprechpartner'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  FormattedContactName : String(81);
  @sap.label : 'Telefon Ansprechpartner'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'tel'
  ContactPhone1 : String(30);
  @sap.label : 'Fax Ansprechpartner'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'tel;type=fax'
  ContactPhone2 : String(30);
  @sap.label : 'E-Mail Ansprechpartner'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'email'
  ContactEmail : String(255);
};

@cds.persistence.skip : true
@sap.service.version : '1'
@sap.content.version : '1'
entity EPM_REF_APPS_PROD_MAN_SRV.Products {
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key Id : String(10);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.semantics : 'currency-code'
  CurrencyCode : String(5);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  StockQuantity : Integer;
  @m.FC_TargetPath : 'SyndicationTitle'
  @m.FC_KeepInContent : 'true'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Name : String(255);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Description : String(255);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  SubCategoryId : String(40);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  SubCategoryName : String(40);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  MainCategoryId : String(40);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  MainCategoryName : String(40);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  SupplierId : String(10);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  SupplierName : String(80);
  @odata.type : 'Edm.DateTime'
  @odata.precision : 7
  @m.FC_TargetPath : 'SyndicationUpdated'
  @m.FC_KeepInContent : 'true'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  LastModified : Timestamp;
  @sap.unit : 'CurrencyCode'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Price : Decimal(15, 2);
  @sap.unit : 'QuantityUnit'
  @sap.label : 'Höhe'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  DimensionHeight : Decimal(13, 3);
  @sap.unit : 'QuantityUnit'
  @sap.label : 'Breite'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  DimensionWidth : Decimal(13, 3);
  @sap.unit : 'QuantityUnit'
  @sap.label : 'Tiefe'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  DimensionDepth : Decimal(13, 3);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  DimensionUnit : String(10);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ImageUrl : String(255);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.semantics : 'unit-of-measure'
  QuantityUnit : String(3);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  MeasureUnit : String(10);
  @sap.label : 'Durchschn. Bewertung'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  AverageRating : Decimal(4, 2);
  @sap.label : 'Anzahl der Prüfungen'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  RatingCount : Integer;
  @sap.unit : 'QuantityUnit'
  @sap.label : 'Gewicht'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  WeightMeasure : Decimal(13, 3);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  WeightUnit : String(10);
  @cds.ambiguous : 'missing on condition?'
  Supplier : Association to EPM_REF_APPS_PROD_MAN_SRV.Suppliers on Supplier.Id = SupplierId;
} actions {
  action EditProduct() returns EPM_REF_APPS_PROD_MAN_SRV.ProductDrafts;
  action CopyProduct() returns EPM_REF_APPS_PROD_MAN_SRV.ProductDrafts;
};

@cds.persistence.skip : true
@sap.content.version : '1'
entity EPM_REF_APPS_PROD_MAN_SRV.ProductDrafts {
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key Id : String(10);
  @odata.type : 'Edm.DateTime'
  @odata.precision : 7
  @m.FC_TargetPath : 'SyndicationUpdated'
  @m.FC_KeepInContent : 'true'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  LastModified : Timestamp;
  @sap.label : 'TRUE'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  IsNewProduct : Boolean;
  @sap.label : 'TRUE'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  IsDirty : Boolean;
  ProductId : String(10);
  @m.FC_TargetPath : 'SyndicationTitle'
  @m.FC_KeepInContent : 'true'
  Name : String(255);
  Description : String(255);
  @sap.label : 'Maßeinheit'
  @sap.semantics : 'unit-of-measure'
  DimensionUnit : String(3);
  @sap.unit : 'DimensionUnit'
  @sap.label : 'Höhe'
  DimensionHeight : Decimal(13, 3);
  @sap.unit : 'DimensionUnit'
  @sap.label : 'Breite'
  DimensionWidth : Decimal(13, 3);
  @sap.unit : 'DimensionUnit'
  @sap.label : 'Tiefe'
  DimensionDepth : Decimal(13, 3);
  @sap.semantics : 'unit-of-measure'
  WeightUnit : String(3);
  @sap.unit : 'WeightUnit'
  @sap.label : 'Gewicht'
  WeightMeasure : Decimal(13, 3);
  @sap.unit : 'CurrencyCode'
  @sap.label : 'Preis'
  Price : Decimal(15, 2);
  @sap.semantics : 'currency-code'
  CurrencyCode : String(5);
  @sap.semantics : 'unit-of-measure'
  QuantityUnit : String(3);
  @sap.label : 'Bild'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ImageUrl : String(255);
  SupplierId : String(10);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  SupplierName : String(80);
  SubCategoryId : String(40);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  SubCategoryName : String(40);
  @sap.label : 'Kategorie'
  MainCategoryId : String(40);
  @sap.label : 'Kategorie'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  MainCategoryName : String(40);
  @odata.type : 'Edm.DateTime'
  @odata.precision : 7
  @m.FC_TargetPath : 'SyndicationPublished'
  @m.FC_KeepInContent : 'true'
  @sap.label : 'Zeitstempel'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  CreatedAt : Timestamp;
  @sap.label : 'Änderer'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  CreatedBy : String(12);
  @odata.type : 'Edm.DateTime'
  @odata.precision : 7
  @sap.label : 'Zeitstempel'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ExpiresAt : Timestamp;
  @cds.ambiguous : 'missing on condition?'
  Images : Association to many EPM_REF_APPS_PROD_MAN_SRV.ImageDrafts {  };
  @cds.ambiguous : 'missing on condition?'
  SubCategory : Association to EPM_REF_APPS_PROD_MAN_SRV.SubCategories on SubCategory.Id = SubCategoryId;
} actions {
  action ActivateProduct() returns EPM_REF_APPS_PROD_MAN_SRV.Products;
};

@cds.persistence.skip : true
@m.HasStream : 'true'
@sap.content.version : '1'
entity EPM_REF_APPS_PROD_MAN_SRV.ImageDrafts {
  @sap.label : 'Knotenschlüssel'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key Id : UUID;
  @sap.label : 'Angelegt von'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  CreatedBy : String(81);
  @m.FC_TargetPath : 'SyndicationTitle'
  @m.FC_KeepInContent : 'true'
  @sap.label : 'Name Bilddatei'
  FileName : String(255);
  @sap.label : 'Ist löschbar'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  IsDeletable : Boolean;
  @sap.label : 'Ist änderbar'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  IsModifiable : Boolean;
  @odata.type : 'Edm.DateTime'
  @odata.precision : 7
  @m.FC_TargetPath : 'SyndicationUpdated'
  @m.FC_KeepInContent : 'true'
  @sap.label : 'Zeitstempel'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  LastModified : Timestamp;
  @sap.label : 'Produkt-ID'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ProductId : String(10);
  @sap.label : 'MIME-Typ'
  @sap.updatable : 'false'
  MimeType : String(100);
  @odata.type : 'Edm.DateTime'
  @odata.precision : 7
  @m.FC_TargetPath : 'SyndicationPublished'
  @m.FC_KeepInContent : 'true'
  @sap.label : 'Zeitstempel'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  CreatedAt : Timestamp;
};

@cds.persistence.skip : true
@sap.content.version : '1'
entity EPM_REF_APPS_PROD_MAN_SRV.MainCategories {
  @m.FC_TargetPath : 'SyndicationTitle'
  @m.FC_KeepInContent : 'true'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key Id : String(40);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Name : String(40);
  @sap.label : 'Unterkategorien'
  @cds.ambiguous : 'missing on condition?'
  SubCategories : Association to many EPM_REF_APPS_PROD_MAN_SRV.SubCategories on SubCategories.MainCategoryId = Id;
};

@cds.persistence.skip : true
@sap.content.version : '1'
entity EPM_REF_APPS_PROD_MAN_SRV.SubCategories {
  @m.FC_TargetPath : 'SyndicationTitle'
  @m.FC_KeepInContent : 'true'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key Id : String(40);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Name : String(40);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  MainCategoryId : String(40);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  MainCategoryName : String(40);
  @cds.ambiguous : 'missing on condition?'
  MainCategory : Association to EPM_REF_APPS_PROD_MAN_SRV.MainCategories on MainCategory.Id = MainCategoryId;
};

@cds.persistence.skip : true
@sap.content.version : '1'
entity EPM_REF_APPS_PROD_MAN_SRV.Currencies {
  @sap.label : 'Iso-Code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key Code : String(3);
  @m.FC_TargetPath : 'SyndicationTitle'
  @m.FC_KeepInContent : 'true'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Text : String(40);
};

@cds.persistence.skip : true
@sap.content.version : '1'
entity EPM_REF_APPS_PROD_MAN_SRV.DimensionUnits {
  @sap.label : 'ISO-Code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key Unit : String(3);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Shorttext : String(10);
  @m.FC_TargetPath : 'SyndicationTitle'
  @m.FC_KeepInContent : 'true'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Text : String(30);
};

@cds.persistence.skip : true
@sap.content.version : '1'
entity EPM_REF_APPS_PROD_MAN_SRV.QuantityUnits {
  @sap.label : 'ISO-Code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key Unit : String(3);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Shorttext : String(10);
  @m.FC_TargetPath : 'SyndicationTitle'
  @m.FC_KeepInContent : 'true'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Text : String(30);
};

@cds.persistence.skip : true
@sap.content.version : '1'
entity EPM_REF_APPS_PROD_MAN_SRV.WeightUnits {
  @sap.label : 'ISO-Code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  key Unit : String(3);
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Shorttext : String(10);
  @m.FC_TargetPath : 'SyndicationTitle'
  @m.FC_KeepInContent : 'true'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Text : String(30);
};

