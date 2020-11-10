define(['accUtils', 'knockout', 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojmasonrylayout', 'ojs/ojselectcombobox'],
    function(accUtils, ko, Bootstrap, ArrayDataProvider) {
        function CDEPViewModel() {
            /*
             * Data
             */
            self.deputati             = ko.observableArray();
            self.deputatiDataProvider = new ArrayDataProvider(self.deputati, { keyAttributes: 'nume' });

            /*
             * Action
             */
            if (self.judet()) {
                getDeputati(self);
            };
            self.judet.subscribe(function() {
                getDeputati(self);
            });

            /*
             * Function
             */
            function getDeputati(self) {
                $.getJSON(['json', self.judet(), 'cdep.json'].join('/'))
                    .done(function(data) {
                        self.deputati(data);
                        $("#masonryLayout").ojMasonryLayout('refresh');
                    })
                    .fail(function() {
                        self.deputati([]);
                    })
            };
        }

        /*
        * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
        * return a constructor for the ViewModel so that the ViewModel is constructed
        * each time the view is displayed.
        */
        return new CDEPViewModel();
    }
);
