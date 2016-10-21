
if (Meteor.isServer) {
	fullpath=process.env.PWD;
	if( typeof fullpath == 'undefined' ){
		base_path = Meteor.npmRequire('fs').realpathSync( process.cwd() + '../../../../../../' );
	}else{
		base_path=fullpath;
	}
}
else{
	base_path="/";
}

Meteoris.Images = new FS.Collection("images", {
	stores: [new FS.Store.FileSystem("images", {path:base_path+"/upload"})]
});