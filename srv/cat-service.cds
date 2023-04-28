using my.beershop as my from '../db/data-model';
using {EPM_REF_APPS_PROD_MAN_SRV as external} from './external/EPM_REF_APPS_PROD_MAN_SRV';

@(requires: 'authenticated-user')
service CatalogService {
    @readonly
    entity CS1TAB           as projection on my.CS1TAB;

    @odata.draft.enabled
    entity Beers            as projection on my.Beers;

    @readonly
    entity Suppliers        as projection on external.Suppliers {
        key Id as ID @(title: '{i18n>ID}'),
            Name     @(title: '{i18n>Name}')
    };

    @readonly
    entity SdkSuppliers     as projection on external.Suppliers {
        key Id   @(title: '{i18n>ID}'),
            Name @(title: '{i18n>Name}')
    };

    @readonly
    entity SdkJwtSuppliers  as projection on external.Suppliers {
        key Id   @(title: '{i18n>ID}'),
            Name @(title: '{i18n>Name}')
    };

    @readonly
    entity SdkDestSuppliers as projection on external.Suppliers {
        key Id   @(title: '{i18n>ID}'),
            Name @(title: '{i18n>Name}')
    };

    @readonly
    entity UserScopes {
        key username  : String  @(title: '{i18n>username}');
            email     : String  @(title: '{i18n>email}');
            firstname : String  @(title: '{i18n>firstname}');
            lastname  : String  @(title: '{i18n>lastname}');
            tenant    : String  @(title: '{i18n>tenant}');
            is_admin  : Boolean @(title: '{i18n>is_admin}');
    };

    function SDKgetOrganizations() returns String;
    function getOrganizations()    returns String;
}
