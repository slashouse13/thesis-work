// Gestione file upload (fasta)
var storage =   multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './uploads');
	},
	filename: function (req, file, callback) {
		fasta=file.fieldname + '_' + date+'.fa';
		callback(null, fasta);
	}
});
var upload = multer({ storage : storage}).single('input_file');
var fasta = "", background="";

// Gestione upload backgroud
var storageBack =   multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './bckgrnd');
	},
	filename: function (req, file, callback) {
		background=file.fieldname + '_' + date
		callback(null, background);
	}
	
});
var uploadBack = multer({ storage : storage}).single('back_file');
