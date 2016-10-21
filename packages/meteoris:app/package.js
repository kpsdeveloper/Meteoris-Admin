Package.describe({
    name: 'meteoris:app',
    version: '0.0.5',
    summary: 'Admin Theme for any meteoris apps.',
    git: 'https://github.com/meteoris/meteoris/tree/master/packages/meteoris:app',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    
    api.versionsFrom('1.2.0.2');

    api.use([
        'templating',
        'meteoris:flash@0.0.0',
        //'mfactory:admin-lte@0.0.0',
        'session@1.1.1',
        'u2622:persistent-session@0.4.4',
        //'fortawesome:fontawesome@4.0.0',
    ], 'client');

    api.use([
        'meteoris:core@0.0.0',
        'meteoris:role@0.0.0',
        //'deps',
        //'session',
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
        'wylio:mandrill@1.0.1',
        //'kadira:debug@3.2.2',
        //'kadira:runtime-dev@0.0.1',
        //'meteorhacks:kadira@2.23.4',
        //'meteorhacks:kadira-profiler@1.2.1'
    ], ['client', 'server']);

    api.addFiles([
        'lib/controllers/AppController.js',
        'lib/controllers/BannersController.js',
        'lib/controllers/ProductsController.js',
        'lib/controllers/OrdersController.js',
        'lib/collections/ThemeAdmin.js',
        'lib/collections/Products.js',
        'lib/collections/Categories.js',
        'lib/collections/Images.js',
        'lib/collections/Carts.js',
        'lib/collections/Orders.js',
        'lib/collections/Contents.js',
        'lib/router.js',
    ], ['client', 'server']);

    api.addFiles([
        'server/ThemeAdminServer.js',
        'server/profile.js',
        'server/Products.js',
        'server/Banner.js',
        'server/Carts.js',
        'server/Orders.js',
        'server/Publish.js'
    ], 'server');

    api.addFiles([
        'client/views/main.html',
        'client/views/main.js',
        'client/views/index.html',
        'client/views/index.js',
        'client/views/header.html',
        'client/views/footer.html',
        'client/views/sidebar.html',
        'client/views/admin/products/index.html',
        'client/views/admin/products/insert.html',
        'client/views/products/detail.html',
        'client/views/products/category.html',
        'client/views/products/filter-product.html',
        'client/views/products/quickview.html',
        'client/views/products/recommended-products.html',
        'client/views/profile/profile.html',
        'client/views/profile/changepassword.html',
        'client/views/cart/cart.html',
        'client/views/orders/chooseAddress.html',
        'client/views/orders/addressDetails.html',
        'client/views/orders/shippingMethod.html',
        'client/views/orders/orderReview.html',
        'client/views/orders/paymentDetails.html',
        'client/views/orders/completedOrder.html',
        'client/views/orders/editAddress.html',
        'client/views/search/searchproduct.html', 
        'client/apps/cart.js',
        'client/apps/profile.js',
        'client/views/admin/banner/addbanner.html',
        'client/views/admin/banner/allbanner.html',
        'client/views/admin/banner/editbanner.html',
        'client/views/admin/banner/viewbanner.html',
        'client/apps/banner.js',
        /*'client/views/login.html',
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
        'client/views/setting-menu.js',*/
        'client/apps/Products.js',
        'client/apps/Orders.js',
        'client/apps/helper.js',
        'client/apps/menu.js',

    ], 'client');
    api.export([
        'UserController',
    ], 'client');

    api.export([
        'Role',
        'RoleGroup',
        'RoleCollection',
    ], ['client', 'server']);
});