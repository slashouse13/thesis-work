//File che contiene tutte le funzioni che manipolano l'input
//Prepara l'input di BEAM
var fs = require("fs");
require('./result.js');
const child = require('child_process');
module.exports = function(){
	// Folding, encoding del background
	this.foldBack=function(background,fold,folder, date, param, motif){
		console.log("sonoInFOLDBACK"+motif)
		backPath=folder+'/background';
		runBash('mkdir '+ backPath,date);
		var flagToDo=0;
		var cmd="";
		setTimeout ( function() {
			try{
				var nt=new RegExp(/^(a|c|u|t|T|g|A|C|G|U)*/);
				var f = fs.readFileSync('uploads/'+background, 'utf8');
				f=f.split('\n');
				f.pop();
				var basta = f[3].match(nt);
				if(f[3][0]=='>'){
					//Già foldato
					console.log("giàfoldato")
					var mv='cp uploads/'+background+' '+backPath+'/folded.fa';
					runBash(mv,date);
					flagToDo=2;
				}
				else{
					if((basta[0].length)==(f[3].length) || (basta[0].length)==(f[3].length-1)){
						//da foldare
						flagToDo=1;
						//console.log(flagToDo);
					}
					else{
						flagToDo=3;
						cmd+='cp uploads/'+background+' '+backPath+'/back_fastb.fa',date;
						//console.log('lunghezze',basta[0].length,f[3].length-1);
					}

				}
			}catch (err){ console.log(err);}
		
			//var cmd ="";
			var toFold = backPath+'/toFold.fa';
			console.log("BCk",flagToDo);
			if (flagToDo==1){
				cmd += 'ruby convert.rb uploads/' + background + ' ' + toFold+' && ';
				if (fold==1){
					//RNAfold
					cmd+= 'RNAfold --noPS < '+ toFold+' > '+backPath+'/RNAfolded.fa && ';
					//CleanEnergies
					cmd += 'python cleanEnergies.py '+backPath+'/RNAfolded.fa > '+backPath+'/folded.fa && ';
				}
				else{
					cmd+= './rnastruct.sh ' +toFold + ' '+backPath+'/folded.fa '+backPath+' && ';
				}
			}
			if(flagToDo<=2){
				//Cambiare T > U
				if(flagToDo==2){
					cmd += 'ruby convert.rb '+ backPath+'/folded.fa ' + backPath+'/folded2.fa && ';
					cmd+='java -jar BearEncoder.jar '+backPath+'/folded2.fa '+backPath+'/back_fastb.fa';
				}else
					cmd+='java -jar BearEncoder.jar '+backPath+'/folded.fa '+backPath+'/back_fastb.fa';
				//runBash(cmd,date);
				//console.log(cmd);
			}
			//cmd+=' && java -jar BEAM_release1.5.2.jar -f '+folder+'/'+date+'.fa -g '+backPath+'/back_fastb.fa '+ param;
			runBash(cmd,date);
			console.log("primaDiRunBEAM"+motif)
			runBeam(background,fold,folder,date,param,backPath, motif);
		}, 500);
	};

	//Esecuzione di un comando da shell (comando è una stringa col comando da eseguire)
	this.runBash=function (cmd,date){
 		var error=false;
		var toLog=[];
		var work = child.spawn(cmd, [],{
			shell:true,
			stdio: 'ignore',
		});
		//console.log(cmd);
		work.on('data', function (data) {

			if(data.indexOf('Exception') > -1){
				fs.writeFileSync(__dirname +'/results/'+ date + '/error',"ERROR");
			}
			//toLog.push(data);
			//console.log(data.toString());
			});
		work.on('error', (err)=>{
			fs.writeFileSync(__dirname +'/results/'+ date + '/error',"ERROR");
		});
		work.on('close', function(code){
			if(cmd.indexOf('BEAM') > -1){			debugger;
				if (code>0 && error){	
					fs.writeFileSync(__dirname +'/results/'+ date + '/error',toLog);
				}else
				if (code>0) {
					error=true;
					console.log("ERRORE!"+cmd);
					fs.writeFileSync(__dirname +'/results/'+date+'/error','');
				}
				else{ error=false;}
			}
			console.log('Comand run exited: code '+code);
		});
	};
	//Folding, encoding del File fasta caricato
	this.foldEncode=function (fasta,fold,motif,folder,boolBackgrn, background,backPath,param,date,flagtodo){
		console.log(boolBackgrn);					//~~~~~~~~~~~~DEBUG~~~~~~~~~~~~
		var toFold = folder+'/toFold.fa';
		var cmd="";
		if (flagtodo==1){
		//console.log("Folding");
			//Cambiare T > U
			cmd += 'ruby convert.rb uploads/' + fasta + ' ' + toFold+' && ';
			fasta='/toFold.fa';
			//RNAfold
			if (fold==1){
				cmd+= 'RNAfold --noPS < '+ folder+fasta +' > '+folder+'/RNAfolded.fa && ';
				//CleanEnergies
				fasta='/RNAfolded.fa';
				cmd += 'python cleanEnergies.py '+folder+fasta+' > '+folder+'/folded.fa && ';
				fasta='/folded.fa';
			}
			if (fold==2){
				//RnaStruct
				cmd+= './rnastruct.sh ' +folder+fasta + ' '+folder+'/folded.fa '+folder+'  && ';
				fasta='/folded.fa';
			}
		}
		//cmd='';
		if(flagtodo<=2){		
			//console.log("qBearing");
			if (flagtodo==2)
				cmd += 'ruby convert.rb '+folder +'/toFold.fa'+ ' ' + folder+'/folded.fa  && ';
			cmd+='java -jar BearEncoder.jar '+folder+'/folded.fa '+folder+'/'+date+'.fa';
			//console.log(cmd);
			fasta=folder+'/'+date+'.fa';
		}
		//runBash(cmd,date);
		if (boolBackgrn){
			console.log("sonoInFoldEncode"+motif)
			foldBack(background,fold,folder, date, param, motif);
		}
		else{
			//console.log("BEAMing");
			if(flagtodo<3)
			cmd+=' && ';
			cmd+='java -jar BEAM_release1.5.2.jar -f '+folder+'/'+date+'.fa '+ param + '&& ';
			cmd+=ris(date,fold,motif);		
			}
		
		runBash(cmd,date);
		
	};
	function runBeam(background,fold,folder, date, param, backPath, motif){
		
		fs.stat(folder+'/'+date+'.fa', function(err,stats){
			if(stats){
				backPath=folder+'/background';
				//console.log("esiste!");
				fs.stat(folder+'/background/back_fastb.fa', function(err,statb){
					if(statb){
						console.log("primaDiLanciareBeam")
						cmdb='java -jar BEAM_release1.5.2.jar -f '+folder+'/'+date+'.fa -g '+backPath+'/back_fastb.fa '+ param+ '&& ';
						
						cmdb+=ris(date,fold,motif);
						console.log("SonoInRunBEAM"+motif)

						runBash(cmdb,date);
						//ris(date,fold,motif);
						//console.log("lanciaBEAM");	
					}
					if(err) runBeam(background,fold,folder, date, param, backPath, motif);
				});
			}
			if(err) runBeam(background,fold,folder, date, param, backPath, motif);
		});
	}
	
}
