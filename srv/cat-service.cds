using my.beershop as my from '../db/data-model';
using {EPM_REF_APPS_PROD_MAN_SRV as external} from './external/EPM_REF_APPS_PROD_MAN_SRV';

@(requires : 'authenticated-user')
service CatalogService {
    @odata.draft.enabled
    entity Beers     as projection on my.Beers;

    entity Suppliers as projection on external.Suppliers {
        key Id as ID, Name
    };
}
