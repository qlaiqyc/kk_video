
module.exports = app => {
  const { router, controller, io,middlewares } = app;

    router.get('/ql/v1/video/tx/getVideoProxy',middlewares.table(), controller.tx.getVideoProxy);
    router.get('/ql/v1/video/tx/getVideo',middlewares.table(),  controller.tx.getVideo);
    router.get('/ql/v1/video/tx/getIndex',middlewares.table(),  controller.tx.getIndex);
    router.get('/ql/v1/video/tx/getVideoByCid',middlewares.table(),  controller.tx.getVideoByCid);
    router.get('/ql/v1/video/tx/getDetail',middlewares.table(), controller.tx.getDetail);
    router.get('/ql/v1/video/tx/getSearchKeys',middlewares.table(),  controller.tx.getSearchKeys);
    router.get('/ql/v1/video/tx/getSearch',middlewares.table(),  controller.tx.getSearch);



    //��������ӿ�  //
    router.get('/ql/v1/data/getData', controller.app.getData);
    router.get('/ql/v1/data/getData2', controller.app.getData2);
  router.get('/ql/v1/data/getData3', controller.app.getData3);
    router.get('/ql/v1/data/getSwiper', controller.app.getSwiper);

    //��̨����ӿ�
    router.get('/ql/v1/admin/search',middlewares.table(), controller.bajie.search);
    router.post('/ql/v1/admin/addIndex',middlewares.table(),  controller.bajie.addIndex);
    router.get('/ql/v1/admin/getIndex',middlewares.table(),  controller.bajie.getIndex);
    router.put('/ql/v1/admin/updateData',middlewares.table(),  controller.bajie.updateData);
    router.delete('/ql/v1/admin/deleteData',middlewares.table(),  controller.bajie.deleteData);
    router.get('/ql/v1/admin/newAdd',middlewares.table(), controller.bajie.newAdd);
    router.get('/ql/v1/admin/newSearch',middlewares.table(),  controller.bajie.AsearchType);
    router.get('/ql/v1/admin/getIndexTypes',middlewares.table(),  controller.bajie.getIndexTypes);





    //�޸�Դ
    router.put("/ql/v1/admin/updateSource",controller.app.updateSource);




    //ǰ̨����
    router.get('/ql/v1/web/ranks',middlewares.table(),  controller.bajie.Qranks);
    router.get('/ql/v1/web/index',middlewares.table(),  controller.bajie.Qindex);
    router.get('/ql/v1/web/video',middlewares.table(),  controller.bajie.Qplay);
    router.get('/ql/v1/web/search',middlewares.table(),  controller.bajie.Qsearch);
    router.get('/ql/v1/web/QsearchType',middlewares.table(),  controller.bajie.QsearchType);
    router.get('/ql/v1/web/config',middlewares.table(),  controller.bajie.Config);

    //微信相关
    router.post('/ql/v1/wx/login',middlewares.table(),  controller.wx.login);
    router.post('/ql/v1/wx/update',middlewares.login(),  controller.wx.update);




    // app.get('/*', controller.app.index);


};
