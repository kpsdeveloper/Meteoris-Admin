
fullpath=process.env.PWD;
  if( typeof fullpath == 'undefined' ){
    base_path = Meteor.npmRequire('fs').realpathSync( process.cwd() + '../../' );
    base_path = base_path.split('\\').join('/');
    base_path = base_path.replace(/\/\.meteor.*$/, '');
  }else{
    base_path=fullpath;
  }
Router.map(function() {
    this.route('serverFile', {
        where: 'server',
        path: /^\/uploads\/(.*)$/,
        action: function() {
           var filePath =  base_path+'/upload/' + this.params;
       //console.log('path:'+filePath);
       try{
          var data = fs.readFileSync(filePath);
          this.response.writeHead(200, {
                'Content-Type': 'image'
           });
           this.response.write(data);
           this.response.end();
           
       }catch(e){
          this.response.writeHead(404, {
                
           });
           this.response.end();
           
       }
           
        }
    });
});