define(['accUtils', 'knockout', 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojmasonrylayout', 'ojs/ojselectcombobox'],
    function(accUtils, ko, Bootstrap, ArrayDataProvider) {
        function SenatViewModel() {
            /*
             * Data
             */
            self.senatori             = ko.observableArray();
            self.senatoriDataProvider = new ArrayDataProvider(self.senatori, { keyAttributes: 'nume' });

            /*
             * Action
             */
            if (self.judet()) {
                getSenatori(self);
            };
            self.judet.subscribe(function() {
                getSenatori(self);
            });

            /*
             * Function
             */
            function getSenatori(self) {
                $.getJSON(['json', self.judet(), 'senat.json'].join('/'))
                    .done(function(data) {
                        self.senatori([]);
                        setTimeout(function() {
                            self.senatori(data);
                            $("#senatoriMasonryLayout").ojMasonryLayout('refresh');
                        }, 125);
                    })
                    .fail(function() {
                        self.senatori([]);
                    })
            };
        }

        /*
        * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
        * return a constructor for the ViewModel so that the ViewModel is constructed
        * each time the view is displayed.
        */
        return new SenatViewModel();
    }
);
