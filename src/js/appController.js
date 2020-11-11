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
        { path: '',      redirect: 'senat' },
        { path: 'senat', detail: { label: 'Senat',              iconClass: 'oj-ux-ico-contact-group' } },
        { path: 'cdep',  detail: { label: 'Camera Deputaților', iconClass: 'oj-ux-ico-contact-group' } }
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
        { name: 'parlamentare2020.bec.ro', linkId: 'BEC',    linkTarget: 'https://parlamentare2020.bec.ro/candidati/' },
        { name: 'GitHub',                  linkId: 'GitHub', linkTarget: 'https://github.com/dandragut/alegeri-parlamentare-2020-web' }
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
      self.judet.subscribe(function(judet) {
        schimbaParametriiInURL();
      });

      /*
       * Stocheaza noi parametrii in URL
       */
      self.schimbaParametriiInURL = function() {
          if (self.judet()) {
             var queryParams = new URLSearchParams();
             queryParams.set('judet', self.judet());
             window.history.replaceState({}, '', '?' + queryParams);
          }
      }
     }

     /*
      * Parametri?
      */
     setTimeout(function() {
       const params = new URLSearchParams(window.location.search);
       if (params.has('judet')) { self.judet(params.get('judet')); }
     }, 1000);

     return new ControllerViewModel();
  }
);
