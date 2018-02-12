exports.init = app => app.use(function* (next) {
	
	this.user = this.req.user || {};
	
	yield *next;

});