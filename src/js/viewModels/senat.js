define(['accUtils', 'knockout', 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojmasonrylayout', 'ojs/ojselectcombobox'],
    function(accUtils, ko, Bootstrap, ArrayDataProvider) {
        function PrimarViewModel() {
            /*
             * Data
             */
            self.senatori             = ko.observableArray();
            self.senatoriDataProvider = new ArrayDataProvider(self.senatori, { keyAttributes: 'nume' });

            self.judet.subscribe(function(judet) {
                $.getJSON(['json', self.judet(), 'senat.json'].join('/'))
                    .done(function(data) {
                        self.senatori(data);
                        $("#masonryLayout").ojMasonryLayout('refresh');
                    })
                    .fail(function() {
                        self.senatori([]);
                    });
            });
        }

        /*
        * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
        * return a constructor for the ViewModel so that the ViewModel is constructed
        * each time the view is displayed.
        */
        return PrimarViewModel;
    }
);
