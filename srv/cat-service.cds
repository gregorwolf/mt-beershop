using my.beershop as my from '../db/data-model';

@(requires : 'authenticated-user')
service CatalogService {
    @odata.draft.enabled
    entity Beers as projection on my.Beers;
}
