using {CatalogService} from '../srv/cat-service';

annotate CatalogService.UserScopes with @(UI : {
  SelectionFields     : [
    username,
    email,
    firstname,
    lastname
  ],
  LineItem            : [
    {Value : username},
    {Value : email},
    {Value : tenant},
    {Value : firstname},
    {Value : lastname},
  ],
  HeaderInfo          : {
    TypeName       : '{i18n>UserScope}',
    TypeNamePlural : '{i18n>UserScopes}',
    Title          : {Value : username},
    Description    : {Value : email},
  },
  Facets              : [{
    $Type  : 'UI.ReferenceFacet',
    Label  : '{i18n>Details}',
    Target : '@UI.FieldGroup#Details'
  }, ],
  FieldGroup #Details : {Data : [
    {Value : username},
    {Value : email},
    {Value : tenant},
    {Value : firstname},
    {Value : lastname},
  ]}
});
