/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define(['knockout', 'ojs/ojmodule-element-utils', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter', 'ojs/ojarraydataprovider', 'ojs/ojknockouttemplateutils', 'ojs/ojmodule-element', 'ojs/ojknockout'],
  function(ko, moduleUtils, ResponsiveUtils, ResponsiveKnockoutUtils, CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter, UrlParamAdapter, ArrayDataProvider, KnockoutTemplateUtils) {
     function ControllerViewModel() {
        this.KnockoutTemplateUtils = KnockoutTemplateUtils;

        // Handle announcements sent when pages change, for Accessibility.
        this.manner = ko.observable('polite');
        this.message = ko.observable();

        announcementHandler = (event) => {
          this.message(event.detail.message);
          this.manner(event.detail.manner);
      };

      document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);

      // Media queries for repsonsive layouts
      const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

      let navData = [
        { path: '', redirect: 'senat' },
        { path: 'senat', detail: { label: 'Senat', iconClass: 'oj-ux-ico-bar-chart' } }
      ];
      // Router setup
      let router = new CoreRouter(navData, {
        urlAdapter: new UrlParamAdapter()
      });
      router.sync();

      this.moduleAdapter = new ModuleRouterAdapter(router);

      this.selection = new KnockoutRouterAdapter(router);

      // Setup the navDataProvider with the routes, excluding the first redirected
      // route.
      this.navDataProvider = new ArrayDataProvider(navData.slice(1), {keyAttributes: "path"});

      // Header
      // Application Name used in Branding Area
      this.appName = ko.observable("Candidaţi - Senat și Camera Deputaților - 6 Decembrie 2020");
      document.title = this.appName();

      // Footer
      this.footerLinks = [
        {name: 'Candidati - BIROUL ELECTORAL CENTRAL', linkId: 'candidati', linkTarget:'https://parlamentare2020.bec.ro/candidati/'}
      ];

      /*
       *
       */
      self.judet      = ko.observable();
      self.judete     = ko.observableArray();

      // Obtine judete...
      $.getJSON('json/judete.json')
        .done(function(data) {
          // Judete...
          self.judete(
            $.map(data, function(item) {
              return { "label": item.nume, "value": item.cod };
            })
          );
        });

      /*
       * Judete (drop-down handler)...
       */
      self.judetSchimba = function(event, data) {
        if ((event.detail.value && !event.detail.previousValue)
          || (event.detail.value && event.detail.previousValue && event.detail.value != event.detail.previousValue)) {

        }
      };

      /*
       * Stocheaza noi parametrii in URL
       */
      self.schimbaParametriiInURL = function() {
          if (self.judet() && self.localitate()) {
             var queryParams = new URLSearchParams();
             queryParams.set('judet',      self.judet());
             queryParams.set('localitate', self.localitate());
             window.history.replaceState({}, '', '?' + queryParams);
          }
      }
     }

     return new ControllerViewModel();
  }
);
