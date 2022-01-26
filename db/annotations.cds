using {my.beershop as beershop} from './data-model';

// Workaround for the pop-up during creation
annotate beershop.Beers with {
    ID @Core.Computed;
}

annotate beershop.Beers with @(UI : {
    SelectionFields     : [
        title,
        stock
    ],
    LineItem            : [
        {Value : title},
        {Value : stock},
        {Value : createdBy},
    ],
    HeaderInfo          : {
        TypeName       : '{i18n>Beer}',
        TypeNamePlural : '{i18n>Beers}',
        Title          : {Value : title}
    },
    Facets              : [{
        $Type  : 'UI.ReferenceFacet',
        Label  : '{i18n>Details}',
        Target : '@UI.FieldGroup#Details'
    }, ],
    FieldGroup #Details : {Data : [
        {Value : title},
        {Value : stock},
        {Value : createdBy},
    ]}
});
