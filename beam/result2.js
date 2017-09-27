fs = require('fs');
process = require('process');
var express = require('express');
var app = express();
require('./funTools.js')();
var content="";
var content2="";
var hist="";
var wb="";
var cartella, reqRes;
var pvalue=[],score=[],coverage=[],listDot=[];
module.exports = function(){
	//Lettura file summary
	function readsummary (name){
		try{
			content=fs.readFileSync(name, 'utf8');
			getSummaryData();
		}
		catch (err){ console.log(err);}
	}
	function getSummaryData(){
		var listMotif = content.split('\n');
		listMotif.pop();		
		for (var i in listMotif){
			var temp=listMotif[i].split('\t');
			pvalue.push(temp[2]);
			score.push(temp[3]);
			coverage.push(temp[4]);
		}
	}
	//Lettura dotBracket
	this.readdot=function (name){
		try{
			content2=fs.readFileSync(name, 'utf8');
			lovelyVarna();
			return true;
		}
		catch (err){ console.log(err);}
	}
	this.lovelyVarna=function(){
		listDot=content2.split('\n');
	}
	//Run script elaborazione risultati
	this.ris=function(nome,fold,motifs){
		pvalue=[],score=[],coverage=[],listDot=[];
		content="",content2="",hist="",wb="";
		cartella=__dirname+"/results/"+nome+'/';
		var cartella2=cartella+"/benchmark/motifs/";
		var cmd='./moveResults.sh '+nome+'\n';
		cmd+='ruby summary_process.rb ' +cartella+ nome+'_summary.txt '+ cartella+nome+'_new_summary.txt\n';
		for(var i=1;i<=motifs;i++){
			if(fold==1)
				cmd+='ruby positionVienna.rb ' +cartella+ nome+'_m'+i+'_run1.search.txt '+ cartella+nome+'_'+i+'_position.txt\n';
			if(fold==2)
				cmd+='ruby positionStruct.rb ' +cartella+ nome+'_m'+i+'_run1.search.txt '+ cartella+nome+'_'+i+'_position.txt\n';
		}
		runBash(cmd);

		//readsummary(cartella+nome+'_new_summary.txt');
		
		for(var i=1;i<=motifs;i++){var cmd2="";
			cmd2+='python bearToDbn.py '+cartella+nome+'_new_summary.txt '+cartella+nome+'_motif.txt\n';
			cmd2+='python printHist.py '+ cartella+nome+'_'+i+'_position.txt '+ cartella+nome+'_'+i+'_hist.png\n';
			cmd2+='./weblogo/weblogo -a \'ZAQXSWCDEVFRBGTNHY\' -f '+cartella+ nome+'_m'+i+'_run1_wl.fa -o '+cartella+ nome+'_'+i+'_weblogoOld.eps -C red ZAQ \'Stem\' -C blue XSW \'Loop\' -C forestgreen CDE \'InternalLoop\' -C orange VFR \'StemBranch\' -C DarkOrange B \'Bulge\' -C lime G \'BulgeBranch\' -C purple T \'Branching\' -C limegreen NHY \'InternalLoopBranch\'\n';
			cmd2+='epstool --copy --bbox '+cartella+nome+'_'+i+'_weblogoOld.eps --output '+cartella+nome+'_'+i+'_weblogo.eps\n';
			cmd2+='eps2png -png -resolution 500 '+cartella+nome+'_'+i+'_weblogo.eps ';
			runBash(cmd2);

		}
	};


	this.structureMotif=function(res,reqRes){
		cartella=__dirname+"/results/"+reqRes+'/';
		for (var i=0; i<(listDot.length); i++){

			var num = i+1;
			cmd2='java -cp VARNAv3-93-src.jar fr.orsay.lri.varna.applications.VARNAcmd -structureDBN \''+listDot[i]+'\' -o '+cartella+'struct_motif_'+num+'.jpeg';
			runBash(cmd2);
		}
		//return true;
	}


	//Creazione pagina-Tabella risultati
	this.results =function(res,reqRes){
		cartella=__dirname+"/results/"+reqRes+'/';
		if(pvalue.length==0){
			readsummary(cartella+reqRes+'_new_summary.txt');
		}	
		
		app.use("/out",express.static(cartella));
		var structure;
		var top = "<html><title> Beam Web Server Results Page </title><link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"http://cdnjs.cloudflare.com/ajax/libs/fancybox/1.3.4/jquery.fancybox-1.3.4.css\" /><link href='http://fonts.googleapis.com/css?family=Oswald:400,700' rel='stylesheet' type='text/css'><link rel=\"stylesheet\" type=\"text/css\" href=\"css/results.css\"><link rel=\"stylesheet\" type=\"text/css\" href=\"css/generale.css\"><header><div id=\"header\" align=\"center\"><img src=\"images/beam.png\" class=\"imghead\"alt=\"logo\" name=\"logo\" /></div><div id=\"navigation\" align=\"center\"><a class=\"menu\" href=\"/home\" target=\"_self\">Home</a> <a class=\"menu\" href=\"/documentation\" target=\"_self\">Documentation</a><a class=\"menu\" href=\"/contacts\" target=\"_self\">Contacts</a> </div></header>";


		var info_run="<fieldset><body><div id=\"info\">Details of your analysis:<br><form method=\"get\" action=\""+reqRes+".tar.gz\">Full results (.zip format):  <button class=\"scarica\" type=\"submit\">Download archive</button></form><br></div><br>";



		var head = "<table id=\"motifs\" class=\"tab\"><thead><tr><th><strong>MOTIF</strong></th><th><strong>WEBLOGO</strong></th><th><strong>STATISTICS</strong></th><th><strong>HISTOGRAM</strong></th><th><strong>STRUCTURE</strong></th></tr></thead><tbody>";



		var bottom = "</tbody></table ></fieldset></body><footer><div id=\"footer\"><img style=\"float:left; vertical-align:central; padding-left:5px; padding-top:2px\" src=\"images/logoTorVergat.png\" width=\"42\" height=\"55\" alt=\"logoTV\" /><div style=\"padding-top:20px;\"> © 2016, Centre for Molecular Bioinformatics, University of Rome \"Tor Vergata\".</div></div></footer>";
var script="<script type=\"text/javascript\" src=\"http://code.jquery.com/jquery-1.11.0.min.js\"></script><script type=\"text/javascript\" src=\"http://code.jquery.com/jquery-migrate-1.2.1.min.js\"></script><script type=\"text/javascript\" src=\"http://cdnjs.cloudflare.com/ajax/libs/fancybox/1.3.4/jquery.fancybox-1.3.4.pack.min.js\"></script><script type=\"text/javascript\">$(function($){var addToAll = false;var gallery = false;var titlePosition = 'inside';$(addToAll ? 'img' : 'img.fancybox').each(function(){var $this = $(this);var title = $this.attr('title');var src = $this.attr('data-big') || $this.attr('src');var a = $('<a href=\"#\" class=\"fancybox\"></a>').attr('href', src).attr('title', title);$this.wrap(a);});if (gallery)$('a.fancybox').attr('rel', 'fancyboxgallery');$('a.fancybox').fancybox({titlePosition: titlePosition});});$.noConflict();</script></html>";
		var tab = "";
		var temp="";
		var temp2="", temp3="";
		for (var i=0;i<(score.length);i++){
			var num = i+1;
			temp=fs.readFileSync(cartella+reqRes+"_"+num+"_hist.png").toString('base64');
			temp2=fs.readFileSync(cartella+reqRes+"_"+num+"_weblogo.png").toString('base64');
			try{		
				fs.statSync(cartella+"struct_motif_"+num+".jpeg");
				temp3=fs.readFileSync(cartella+"struct_motif_"+num+".jpeg").toString('base64');
				structure='<img id="pic" src="data:image/jpeg;base64, '+temp3+'" tabindex="0"/>';
			}
			catch (err){
				structure='Structure not available';
			}
			hist='<img id="his" src="data:image/png;base64, '+temp+'" tabindex="0"/>';
			wb='<img id="wl" class=\"fancybox\" data-big="'+temp2+'" src="data:image/png;base64, '+temp2+'" tabindex="0" width="300px" height="100px"/>';
		

			pv=pvalue[i].split('=');
			sc=score[i].split('=');
			co=coverage[i].split('=');
			
			tab+="<tr><td>"+ num +"</td><td>"+wb+"</td><td>P-Value: "+ pv[1] +"<br><br>Beam Score: "+ sc[1] +"<br><br>Covariance: "+ co[1] +"</td><td>"+hist+"</td><td>"+structure+"</td></tr>";
		}
		res.write(top+info_run+head+tab);
		res.write(bottom+script);
		res.end();
	};

}
