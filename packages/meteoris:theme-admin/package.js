Package.describe({
    name: 'meteoris:theme-admin',
    version: '0.0.5',
    summary: 'Admin Theme for any meteoris apps.',
    git: 'https://github.com/meteoris/meteoris/tree/master/packages/meteoris:theme-admin',
    documentation: 'README.md'
});

Package.onUse(function(api) {

    api.versionsFrom('1.2.0.2');

    api.use([
        'templating',
        'meteoris:flash@0.0.0',
        'session@1.1.1',
        //'mfactory:admin-lte@0.0.0',
        //'fortawesome:fontawesome@4.0.0',
    ], 'client');

    api.use([
        'meteoris:core@0.0.0',
//        'session',
        'mongo',
        'kadira:flow-router@2.0.0',
        'kadira:blaze-layout@2.0.0',
        'zephraph:namespace@1.0.0',
        'aldeed:collection2@2.0.0',
        'aldeed:simple-schema@1.0.0',
        'rochal:slimscroll@1.0.0',
        'cfs:standard-packages@0.0.0',
        'tap:i18n@1.2.1',
        'tap:i18n-db@0.4.0',
        'mrt:fs@0.1.5',
        'cfs:filesystem@0.0.0',
    ], ['client', 'server']);

    api.addFiles([
        'lib/collections/ThemeAdmin.js',
        'lib/collections/Products.js',  
        'lib/collections/Images.js',
        'lib/collections/Carts.js',
        'lib/collections/Orders.js',
        'lib/collections/Categories.js',
        'lib/collections/Contents.js',
        'lib/router.js',
        'lib/controllers/ThemeAdminController.js',
        'lib/controllers/BannersController.js',
        'lib/controllers/ProductsController.js',
        'lib/controllers/OrdersController.js',
        
    ], ['client', 'server']);

    api.addFiles([
        'server/ThemeAdminServer.js',
        'server/Publish.js',
        'server/Banner.js',
        'server/Products.js',
        'server/Orders.js',
    ], 'server');

    api.addFiles([
        /* assets */
        'client/assets/adminlte-app.js',
        /* views */
        'client/views/index.html',
        'client/views/index.js',
        'client/views/main.html',
        'client/views/main.js',
        'client/views/login.html',
        'client/views/login.js',
        'client/views/register.html',
        'client/views/register.js',
        'client/views/header.html',
        'client/views/header.js',
        'client/views/sidebar.html',
        'client/views/control-sidebar.html',
        'client/views/footer.html',
        'client/views/footer.js',
        'client/views/setting.html',
        'client/views/setting.js',
        'client/views/setting-menu.html',
        'client/views/setting-menu.js',
        'client/views/banner/allbanner.html',
        'client/views/banner/addbanner.html',
        'client/views/banner/editbanner.html',
        'client/views/banner/viewbanner.html',
        'hook/meteoris_themeAdmin_hookSidebar.html',
        'client/apps/banner.js',
        'client/views/products/product.html',
        'client/views/products/insert.html',
        'client/views/products/update.html',
        'client/apps/Products.js',
        'client/apps/helper.js',
        'client/views/orders/order.html',
        'client/views/orders/view.html',
        'client/views/orders/insert.html',
        'client/views/orders/shippingMethod.html',
        
        'client/apps/Orders.js',
    ], 'client');

});