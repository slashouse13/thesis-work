var express = require('express');
var app = express();
var multer  =   require('multer');
var path = require('path');
var fs = require("fs");
var ip = require("ip");
var js = require('jsdom');
var expreg = require("regex");
var formidable = require('formidable'), util = require('util');
//var ip="160.80.35.91";
var getIp = require('ipware')().get_ip;
var url  = require('url');
const child = require('child_process');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname+'/public'));
require('./funTools.js')();
require('./result.js')();
//Parser per trovare cartella risultati
function parseUrl(url){
	var regex=/\.*\/[0-9]*$/;
	return(url.match(regex));
}

app.route('/').get(function (req, res) {
	res.redirect('/home');
})

app.get('/home', function (req, res) {
	console.log("/home requested");
	file_ex="";
	reqRes;
	endOfExec = false;
	fold=0;
	motif=0;
	textArea = "";
	backPath="";
	boolFasta=false;
	boolExample=false;
	boolFound=false;
	boolMotif=false;
	res.sendFile( __dirname + "/public/" + "home.html" );
	
})

//Variabili globali
var file_ex="";
var valid=true;
var folder;
var reqRes;
var endOfExec = false;

var textArea = "";
var backPath;
//Flag controllo
var boolFasta;
var boolExample;
var boolFound;
var boolMotif;
var user=[];
//Nome cartella risultati
var date;

//"importa" la parte di codice che prepara il file in upload.
//Alloca le risorse
eval(fs.readFileSync('upload.js')+'');

//Fasta upload
app.post('/file_upload', function(req, res){
			debugger;	
	if(user.length==0){ //Se non ci sono esecuzioni in coda...
		date=Date.now();//necessario per passarlo alla funzione upload
		user.push([req.headers["x-forwarded-for"], date, 0, 0, false]);//Conterra' [ip, nome run, #motif, fold, background si/no]
	}
	else{
		var i=0;
		while(i<user.length){
			if(user[i][0]===req.headers["x-forwarded-for"]){ //Se questo utente ha già caricato un file in back, assegna la stessa data
				date=user[i][1];
				break;
			}
			i=i+1;			
		}
		if(i==user.length){
				date=Date.now();
				user.push([req.headers["x-forwarded-for"], date, 0, 0, false]);
		}
	}
	console.log("file",date)
	console.log("/file_upload requested");
	boolFasta=true; //Stava ad indicare la presenza del file di input
	upload(req,res,function(err) {
        if(err) {
		console.log(err);
        	return res.end("Error uploading file.");
        }

        res.end("File is uploaded");
    });
});

//Background
app.post('/back_upload', function(req,res){
	console.log("/back_upload requested");
			debugger;	
	if(user.length==0){ //Se non ci sono esecuzioni in coda...
		date=Date.now(); //necessario per passarlo alla funzione upload
		user.push([req.headers["x-forwarded-for"], date, 0, 0, true]);//Conterra' [ip, nome run, #motif, fold, background si/no]
	}
	else{
		var i =0;
		while(i<user.length){
			if(user[i][0]===req.headers["x-forwarded-for"]){ //Se questo utente ha già caricato un file in input..assegna la stessa data
				date=user[i][1];
				user[i][4]=true; //flag backgound
				break;
			}
			i=i+1;			
		}
		if(i==user.length){
				date=Date.now();
				user.push([req.headers["x-forwarded-for"], date, 0, 0, true]);
			}
	}

	uploadBack(req,res,function(err){
	if(err){
		console.log(err);
		return("Error while uploading file.");
	}
	res.end("File uploaded");
	});
});

//Start button
app.post('/start', function(req,res){
	console.log("/start requested");
	//Prendo tutte i campi in opzioni
	var wmin;
	var wmax;
	var clean;
	var form = new formidable.IncomingForm();
	var fold, motif;
	var run,temp,smin,smax,cool,sampling,branch,keep,randomS,newString;
	form.parse(req, function (err, fields, files){
		//Prendo tutti i parametri della form
		if (!boolFasta){
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TextArea~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			date=Date.now();
			textArea=fields["textfield"];
		//Da qui in poi potrebbe essere spostato fuori da questo if gigante
			wmin=fields["windowmin"];
			wmax=fields["windowmax"];
			motif=fields["motifs"];
			clean=fields["clean"];
			fold=fields["fold"];
			temp=fields["temp"];
			smin=fields["smin"];
			smax=fields["smax"];
			cool=fields["cooling"];
			branch=fields["branch"];
			run=fields["run"];
			sampling=fields["sampling"];
			keep=fields["keep"];
			randomS=fields["random"];
			newString=fields["newString"]
			//Stringa con i parametri di BEAM
			var parameters = '-w '+wmin+' -W '+wmax+' -v t -C '+clean+' -M '+motif+' -s '+smin+' -S '+smax+' -T '+temp+' -r '+cool+' -R '+randomS+' -n '+sampling + ' -b '+branch + ' -k ' + keep+ ' ' +newString+ ' ';
			//caricamento dati run nel vettore user
			folder=date;
			user.push([req.headers["x-forwarded-for"], date, 0, motif,fold, false]);
			//crea cartella risultati
			var cmd = 'mkdir results/'+folder;
			runBash(cmd,date);

			folder='results/'+folder;
			//probabilmente non serve
			backPath=folder+'/background';
			
			fasta="input_file_"+date+".fa";
			//check textarea format
			var nt=new RegExp(/^(a|c|u|t|T|g|A|C|G|U)*/);
			var dot=new RegExp(/^(\(|\)|\.)*/);
			var checker=[];
			var boolQ = true;
			var boolDot = true;
			var valid=false;
			if(textArea[0]=='>'){ //controlla se comincia con il nome

				checker=textArea.split('\n');
				//Non voleva prendere l'ultima riga
				checker[checker.length-1]+=(textArea[textArea.length-1]);
				//valutazione expReg
				var basta = checker[3].match(nt);
				//Formato: [0]:match trovato
					 //[3]:stringa query
				if(checker[3][0]=='>'){
					boolQ=false; //se la terza riga ha il nome, e' gia' foldato
				}
				else
					if((basta[0].length)==(checker[3].length-1)){
						//se nella terza riga contiene i nucleotidi, ha solo le sequenze
						boolQ=false; boolDot=false;

					}
					//Altrimenti e' pronto per essere dato in pasto a BEAM
					else{ boolDot=true; boolQ=true;}
				//Controllo riga per riga
				for(var i=1; i<(checker.length); i++){
					basta=checker[i].match(nt);//Check nucleo
					if(checker[i-1][0]=='>' && ( ((basta[0].length)==(checker[i].length-1)) ||(basta[0].length==(checker[i].length)))){//guarda se la coppia di righe e' nucleo - nome
						valid=true;
					}
					else{ 
						basta=checker[i-1].match(nt);
						var punto=checker[i-1].match(dot);// expReg dot bracket riga (i-1)-esima
						var testa=checker[i].match(dot);// expReg dot bracket riga i-esima

						if((testa[0]!='') || (punto[0]!='')){//Se e' presente una dot bracket nelle righe correnti
							if(((basta[0].length)==(checker[i-1].length-1)) && ((testa[0].length==(checker[i].length-1))||(testa[0].length==(checker[i].length)))){//guarda se la coppia di righe e' dot - nucleo
								valid=true;
							}
							else{
								if((punto[0].length==(checker[i-1].length-1)) && boolQ){ 
									//guarda se la coppia di righe e' qbear - dot
									valid=true;
								}
								else
									if(checker[i][0]=='>'){//guarda se la riga corrente e' il nome
										valid=true;
									}
									else{//Non e' una stringa valida;
										valid=false;
										break;
									}
							}
						}
						else{//No dot bracket e nucleotidi in righe correnti
							if(checker[i][0]=='>'){//nome
								valid=true;
							}
							else{//stringa non valida;
								valid=false;
								break;
							}
						}
					}
				}
			}
			
			if(valid){
			//se e' tutto ok, salva la texarea in un file
				fs.writeFileSync("uploads/de-"+fasta, textArea);
				//purtroppo serve questo script per eliminare uno \r in piu'
				runBash('python saveTheTextArea.py uploads/de-'+fasta+' uploads/'+fasta,date);
				//Controlli per il lancio della serie di comandi (fold, bear e beam)
				var nt=new RegExp(/(a|c|u|g|A|C|G|U)*/g);
				setTimeout ( function() {
					try{
						var f = fs.readFileSync('uploads/'+fasta, 'utf8');
						f=f.split('\n');
						f.pop();//l'ultimo carattere è sempre uno \n
						if(f[3][0]=='>'){
							//Già foldato
							var mv='cp uploads/'+fasta+' '+folder+'/toFold.fa';
							runBash(mv,date);
							//console.log(mv);
							foldEncode('/toFold.fa',fold,motif,folder,false, background,backPath,parameters,date,2);
						}
						else{
							if((boolDot==false) && (boolQ==false)){
								//da foldare
								foldEncode(fasta,fold,motif,folder,false, background,backPath,parameters,date,1);
							}
							else{
								//completo
								runBash('cp uploads/'+fasta+' '+folder+'/'+date+'.fa',date);
								fasta='/'+date+'.fa';
								foldEncode(fasta,fold,motif,folder,false, background,backPath,parameters,date,3);
							}
						}
					}catch (err){ console.log(err);}
				}, 1000);
				res.redirect('/loading');
			}
			else {
				res.redirect('/error');
			}
			
		}
		else{	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FILE UPLOADED~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			wmin=fields["windowmin"];
			wmax=fields["windowmax"];
			motif=fields["motifs"];
			clean=fields["clean"];
			fold=fields["fold"];	
			temp=fields["temp"];
			smin=fields["smin"];
			smax=fields["smax"];
			cool=fields["cooling"];
			branch=fields["branch"];
			run=fields["run"];
			sampling=fields["sampling"];
			keep=fields["keep"];
			randomS=fields["random"];
			newString=fields["newString"]
			//console.log(newString)
			var boolBack = false;
			var parameters = '-w '+wmin+' -W '+wmax+' -v t -C '+clean+' -M '+motif+' -s '+smin+' -S '+smax+' -T '+temp+' -r '+cool+' -R '+randomS+' -n '+sampling + ' -b '+branch + ' -k ' + keep+' '+newString+ ' ';

			//visto che qui non c'e' scoping per le variabili, andiamo a ripescare il #run
			for(i in user)
				if(req.headers["x-forwarded-for"]==user[i][0]){
					date=user[i][1];
					user[i][3]=motif;
					user[i].push(fold);
					boolBack=user[i][4];
					if(boolBack)
						background='back_file_'+date+'.fa';
				}
			folder=date;
			var cmd = 'mkdir results/'+folder;
			runBash(cmd,date);
			folder='results/'+folder;
			backPath=folder+'/background';
			fasta="input_file_"+date+".fa";
			console.log("fasta",date, boolBack);
			//Check fasta format
			try{
				var nt=new expreg(/(a|c|u|t|g|A|T|C|G|U)*/);
				var f = fs.readFileSync('uploads/'+fasta, 'utf8');
				f=f.split('\n');
				f.pop();
				
				if(f[3][0]=='>'){
					//Già foldato
					var mv='cp uploads/'+fasta+' '+folder+'/toFold.fa';
					//console.log(mv)
					runBash(mv,date);
					foldEncode(fasta,fold,motif,folder,boolBack, background,backPath,parameters,date,2);
				}
				
				else{
					//console.log("test " + nt.test(f[3].slice(0, -1)))
					//viene eseguito il test dei caratteri su tutta la stringa ad eccezione dell'ultimo carattere che potrebbe essere un \r
					if(nt.test(f[3].slice(0, -1))){
						//da foldare
						foldEncode(fasta,fold,motif,folder,boolBack, background,backPath,parameters,date,1);
					}
					else{
						//completo
						runBash('cp uploads/'+fasta+' '+folder+'/'+date+'.fa',date);
						fasta='/'+date+'.fa';
						foldEncode(fasta,fold,motif,folder,boolBack, background,backPath,parameters,date,3);
					}
				}
			}catch (err){ console.log(err);
			}

			res.redirect('/loading');
		}
		
	});	
});
/*
//Redirect a pagina temporanea
app.route('/wait').get(function(req,res){
	console.log("/wait requested");
	for(i in user)
		if(req.headers["x-forwarded-for"]===user[i][0])
			reqRes=user[i][1];
	return tempResults(reqRes, res,req);
});

//funzione che restituisce una pagina html con il link
function tempResults (reqRes,res,req){
	for(i in user)
		if(req.headers["x-forwarded-for"]===user[i][0])
			reqRes=user[i][1];
	res.write("<html><title>Pre Result Room - Beam Web Server</title><link href='http://fonts.googleapis.com/css?family=Oswald:400,700' rel='stylesheet' type='text/css'><link rel=\"shortcut icon\" type=\"image/x-icon\" href=\"images/favicon.ico\" /><link rel=\"stylesheet\" type=\"text/css\" href=\"css/wait.css\"><link rel=\"stylesheet\" type=\"text/css\" href=\"css/generale.css\"><header><div id=\"header\" align=\"center\"><img src=\"images/beam.png\" class=\"imghead\" alt=\"logo\" name=\"logo\"/></div><div id=\"navigation\" align=\"center\"><a class=\"menu\" href=\"/home\" target=\"_self\">Home</a> <a class=\"menu\" href=\"/documentation\" target=\"_self\">Documentation</a><a class=\"menu\" href=\"/contacts\" target=\"_self\">Contacts</a> </div></header><body><fieldset><br>Your results will be available at the following link: <a href=\"/results\">/"+reqRes+"</a><br></fieldset></body><footer><div id=\"footer\"><img id=\"pic_footer\" src=\"images/logoTorVergat.png\" alt=\"logoTV\" /><div style=\"padding-top:20px;\"> © 2016, Centre for Molecular Bioinformatics, University of Rome \"Tor Vergata\".</div></div></footer></html>");
	res.end();
}
*/
app.route('/results').get(function(req,res){
	for(i in user)
		if(req.headers["x-forwarded-for"]===user[i][0]){
			reqRes=user[i][1];
			user.splice(i,1);
		}
		results(res,reqRes)
});


app.route('/loading').get(function(req,res){
	console.log("/loading requested");
	var pos,fld,mo;
	for(i in user){
		//Check indirizzo IP
		if(req.headers["x-forwarded-for"]===user[i][0]){//se esiste
			pos=i;			//salva la posizione
			reqRes=user[i][1];	//salva la data
			if (user[i][3]==0 || typeof user[i][3]=='undefined'){
				fs.readdir(__dirname + "/results/"+reqRes, function(err, files){
					if (err) throw err;
					if (files){
						for (x in files){
							var tempor=files[x].indexOf('_run1.search.txt');
							if (tempor>0){						
								mo=parseInt(files[x][tempor-1],10);
								user[i].push(mo);
							}
						}
					}
				});

			}else
			mo=user[i][3];
			fld=user[i][4];
		}
	}
	console.log("Loading ", user);
	fs.stat('risultati/'+reqRes+'/benchmark/motifs/'+reqRes+'_m'+mo+'_run1.txt',function(err,stats){
		if(stats){
			//console.log("c'è _run1.txt")
			//sris(reqRes,fld,mo);
			res.redirect('/'+reqRes);
		}
		else{
			//console.log("manca qualcosa")
			fs.stat('results/'+reqRes+'/error', function(err, stats){
				if(stats)
					res.redirect('/error')
					//getError(res);
				if (err){
					for(i in user)
						if(req.headers["x-forwarded-for"]===user[i][0])
							pos=i;
					if(typeof(pos)=='undefined'){
						notFoundPage(res);
					}
					else{
						writeInLoading(res,req); 
					}
				}
			});
		}
	});
	
});
//Loading-waiting page ***static***
function writeInLoading(res,req){
	var perc;
	for(i in user)
		if(req.headers["x-forwarded-for"]===user[i][0]){
			reqRes=user[i][1];
		}
	res.write("<html><title>Loading - Beam Web Server</title><link href='http://fonts.googleapis.com/css?family=Oswald:400,700' rel='stylesheet' type='text/css'><link rel=\"shortcut icon\" type=\"image/x-icon\" href=\"images/favicon.ico\" /><link rel=\"stylesheet\" type=\"text/css\" href=\"css/generale.css\"><link rel=\"stylesheet\" type=\"text/css\" href=\"css/loading.css\"><header><div id=\"header\" align=\"center\"><img src=\"images/beam.png\" class=\"imghead\" alt=\"logo\" name=\"logo\"/></div><div id=\"navigation\" align=\"center\"><a class=\"menu\" href=\"/home\" target=\"_self\">Home</a> <a class=\"menu\" href=\"/documentation\" target=\"_self\">Documentation</a><a class=\"menuLast\" href=\"/contacts\" target=\"_self\">Contacts</a> </div></header><body onload=\"timer=setTimeout(function(){ window.location='/loading';},30000 )\"><fieldset><br>Your results are being processed..Please wait<br>You will find your results by bookmarking this link: <a class=\"special\" href=\"/"+reqRes+"\">beam.uniroma2.it/"+reqRes+"</a><br><p>This page will refresh in <span id=\"countdown\"></span> seconds</p></fieldset><br>\n<script>\n(function countdown(remaining) {\nif(remaining <= 0)\nlocation.reload(true);\ndocument.getElementById('countdown').innerHTML = remaining;\nsetTimeout(function(){ countdown(remaining - 1); }, 1000);\n})(30);\n</script></fieldset></body><footer><div id=\"footer\"><img id=\"pic_footer\" src=\"images/logoTorVergat.png\" alt=\"logoTV\" /><div style=\"padding-top:20px;\"> © 2016, Centre for Molecular Bioinformatics, University of Rome \"Tor Vergata\".</div></div></footer></html>");
	res.end();
}
//404 error page
app.route('/notFound').get(function(req,res){
	console.log("/notfound requested");
	return(notFoundPage(res));
});
function notFoundPage(res){
	res.sendFile( __dirname + "/public/" + "notFound.html" );
}

app.route('/data').get(function(req,res){
	console.log("/data requested");
	return (dataPage(res));
});
function dataPage(res){
	res.sendFile( __dirname + "/public/data.html");
}
//Error Page
app.route('/error').get(function(req,res){
	console.log("/error requested");
	//If error occurs, delete user's IP and data
	for(i in user)
		if(req.headers["x-forwarded-for"]===user[i][0]){
			console.log(req.headers["x-forwarded-for"]);
			reqRes=user[i][1];
			user.splice(i,1);
			console.log(user);
		}
	return(getError(res));
});
function getError(res){
	res.write("<html><title>Error - Beam Web Server</title><link href='http://fonts.googleapis.com/css?family=Oswald:400,700' rel='stylesheet' type='text/css'><link rel=\"shortcut icon\" type=\"image/x-icon\" href=\"images/favicon.ico\" /><link rel=\"stylesheet\" type=\"text/css\" href=\"css/generale.css\"><link rel=\"stylesheet\" type=\"text/css\" href=\"css/wait.css\"><header><div id=\"header\" align=\"center\"><img src=\"images/beam.png\" class=\"imghead\" alt=\"logo\" name=\"logo\"/></div><div id=\"navigation\" align=\"center\"><a class=\"menu\" href=\"/home\" target=\"_self\">Home</a> <a class=\"menu\" href=\"/documentation\" target=\"_self\">Documentation</a><a class=\"menuLast\" href=\"/contacts\" target=\"_self\">Contacts</a> </div></header><body><fieldset><br>An error has occurred.<br><ul><li>You have uploaded a wrong file format!!</li><li>Check your file for wrong characters;</li><li>Check your file for random return characters, or if any sequence is broken in 2 or more lines;</li><li>Internal BEAM error</li></ul> Click <a href=\"/home\" />here</a> to go back to the homepage<br></fieldset></body><footer><div id=\"footer\"><img id=\"pic_footer\" src=\"images/logoTorVergat.png\" alt=\"logoTV\" /><div style=\"padding-top:20px;\"> © 2016, Centre for Molecular Bioinformatics, University of Rome \"Tor Vergata\".</div></div></footer></html>");
	res.end();
}

//Download page
app.get('/download',function(req,res){
console.log("/download requested");
	res.sendFile( __dirname + "/public/" + "download.html" );
});
//Doc page
app.get('/documentation',function(req,res){
console.log("/doc requested");
	res.sendFile( __dirname + "/public/" + "documentation.html" );
});
//Contacts page
app.get('/contacts',function(req,res){
console.log("/contacts requested");
	res.sendFile( __dirname + "/public/" + "contacts.html" );
});

app.get('/*.zip', function(req,res){
	for(i in user)
		if(req.headers["x-forwarded-for"]===user[i][0])
			reqRes=user[i][1];
	res.sendFile(__dirname+'/results/'+reqRes+'/'+reqRes+".zip");
});

//Gestione link risultati
app.get('/*', function(req,res){
	var url_parts = url.parse(req.url);
	var evalPage = parseUrl(url_parts.pathname);
	if (evalPage!=null){	
		reqRes = evalPage[0].slice(1);
		//app.use(express.static(cartella));
		//quando richiede una pagina con codice run, estrae il numero della run dall'indirizzo
		if (user.length==0)
			user.push([req.headers["x-forwarded-for"],reqRes]);
		//controlla la sua cartella
		fs.readdir(__dirname + "/results", function(err, files){

			if (files){
				for (var i in files){
					if (files[i]==reqRes){
						boolFound=true;	//Cartella trovata
						var boolVarna=false;
						var cartella=__dirname+"/results/"+reqRes;
						app.use(express.static(cartella));
						//Se una run ha già finito, manda l'html già pronto
						fs.stat(cartella +'/'+reqRes+'.html', function (err,stats){
							if(stats){
								res.sendFile(cartella +'/'+reqRes+'.html');
								for(j in user)
									if(req.headers["x-forwarded-for"]===user[j][0]){
										reqRes=user[j][1];
										user.splice(j,1);
									}
							}	
							else{
								var pos=0,mo=0;
								if(typeof user != undefined)
								//se il vettore user ha qualcosa dentro..
								for(i in user)
									if(req.headers["x-forwarded-for"]===user[i][0]){
										pos=i;
										mo=user[i][3];
									}
								//ha fatto il weblogo?
								fs.stat('results/'+reqRes+'/'+reqRes+'_'+mo+'_weblogo.png', function (err,stats){
									console.log("Ha fatto il web logo")
									if(stats){
										//Estrai i motivi per VARNA
										readdot(cartella+'/'+reqRes+'_motif.txt');
										//ha fatto il varna?
										fs.stat('results/'+reqRes+'/'+'struct_motif_'+mo+'.jpeg', function (err,varna){
											if(varna){
												boolVarna=true
												res.redirect('/results');
											}
											else {
												structureMotif(res,reqRes); //VARNA
												writeInLoading(res,req);	//VARNA è in esecuzione
											}
											//console.log('results/'+reqRes+'/'+'struct_motif_'+mo+'.jpeg')
											//fs.stat('results/'+reqRes+'/'+'struct_motif_'+mo+'.jpeg', function (err,varna){
											//	if (!boolVarna) {      
                                             //   }
											//	else {
											//		console.log("lafinediVarna"
										});
									}
								
									if(err){
										//altrimenti BEAM sta ancora girando
										//console.log("Non esiste il weblogo: "+reqRes);
										writeInLoading(res,req);
									}
								});
							}
						});
							
					}
				}
			
			}
			if (err) res.redirect('/notFound');//forse è meglio redirigere a errore già da qui
		});
	
	}
});

//Server up
var server = app.listen(8081, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log("Listening @ http://%s:%s", ip.address(), port);
})

