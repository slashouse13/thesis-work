fs = require('fs');
process = require('process');
var math =require('mathjs');
var express = require('express');
var app = express();
require('./funTools.js');
var content="";
var content2="";
var content3="";
var content4="";
var hist="";
var wb="";
var cartella, reqRes;
var pvalue=[],score=[],coverage=[],listDot=[],listMotif=[],listStart=[],listEnd=[],listLenght=[];
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
		var listMotif1 = content.split('\n');
		listMotif1.pop();		
		for (var i in listMotif1){
			var temp=listMotif1[i].split('\t');
			//console.log(temp);
			pvalue.push(temp[2]);
			score.push(temp[4]);
			coverage.push(temp[5]);
		}
	}
	//Lettura dotBracket
	readdot=function (name){
		try{
			content2=fs.readFileSync(name, 'utf8');
			lovelyVarna();
			return true;
		}
		catch (err){ console.log(err);}
	}
	lovelyVarna=function(){
		listDot=content2.split('\n');
	}

	function getListMotif(filemo){
		try{
			//debugger;
			var row = "";
			content3=fs.readFileSync(filemo, 'utf8');
			row=content3.split('\n');
			row.pop();
			for (i in row){
				var column=row[i].split('\t');
				column[6]=parseFloat(column[6]);
				listMotif.push(column);
			}
			listMotif.sort(function(a,b) {
				return b[6]-a[6]
			    });
		}catch(err){console.log(err);}
	}
	
	structureMotif=function(res,reqRes){
		cartella=__dirname+"/results/"+reqRes+'/';
		for (var i=0; i<(listDot.length); i++){

			var num = i+1;
			cmd2='java -cp VARNAv3-93-src.jar fr.orsay.lri.varna.applications.VARNAcmd -structureDBN \''+listDot[i]+'\' -o '+cartella+'struct_motif_'+num+'.jpeg';
			runBash(cmd2,reqRes);
		}
		//return true;
	}

	//Run script elaborazione risultati
	ris=function(nome,fold,motifs){
		//console.log("ris", nome);					//~~~~~~~~~~~~DEBUG~~~~~~~~~~~~~
		content="",content2="",hist="",wb="";
		cartella=__dirname+"/results/"+nome+'/';
		var cartella2=cartella+"/benchmark/motifs/";

		var cmd='./moveResults.sh '+nome+' && ';
		console.log("hospostatoiFile")
		cmd+='ruby summary_process.rb ' +cartella+ nome+'_summary.txt '+ cartella+nome+'_new_summary.txt';
		for(var i=1;i<=motifs;i++){
			cmd+=' && ruby positionVienna.rb ' +cartella+ nome+'_m'+i+'_run1.search.txt '+ cartella+nome+'_'+i+'_position.txt && ';
			cmd+='python getListMotif.py '+cartella+nome+'_m'+i+'_run1.search.txt '+ cartella+nome+'_'+i+'_listMotif.txt';
		}
		//runBash(cmd,nome);
		//console.log(cmd)
		var cmd2="";
		for(var i=1;i<=(motifs);i++){
			//console.log(i);
			cmd2+=' && python bearToDbn.py '+cartella+nome+'_new_summary.txt '+cartella+nome+'_motif.txt && ';
			cmd2+='python printHist.py '+ cartella+nome+'_'+i+'_position.txt '+ cartella+nome+'_'+i+'_hist.png && ';
			cmd2+='./weblogo/weblogo -a \'ZAQXSWCDEVFRBGTNHY\' -f '+cartella+ nome+'_m'+i+'_run1_wl.fa -o '+cartella+ nome+'_'+i+'_weblogoOld.eps -C red ZAQ \'Stem\' -C blue XSW \'Loop\' -C forestgreen CDE \'InternalLoop\' -C orange VFR \'StemBranch\' -C DarkOrange B \'Bulge\' -C lime G \'BulgeBranch\' -C purple T \'Branching\' -C limegreen NHY \'InternalLoopBranch\' && ';
			cmd2+='epstool --copy --bbox '+cartella+nome+'_'+i+'_weblogoOld.eps --output '+cartella+nome+'_'+i+'_weblogo.eps && ';
			cmd2+='eps2png -d 500 '+cartella+nome+'_'+i+'_weblogo.eps';
			//runBash(cmd2,nome);
			//console.log(cmd2)
		}

		return cmd+cmd2;	
	};

	//Creazione pagina-Tabella risultati
	results =function(res,reqRes){
		debugger;
		pvalue=[],score=[],coverage=[],listDot=[];
		var warning="";
		cartella=__dirname+"/results/"+reqRes+'/';
		readsummary(cartella+reqRes+'_new_summary.txt');
		app.use("/out",express.static(cartella));
		var structure;
		var top = "<html>\n<title> Beam Web Server Results Page </title>\n<link href='http://fonts.googleapis.com/css?family=Oswald:400,700' rel='stylesheet' type='text/css'><link rel=\"shortcut icon\" type=\"image/x-icon\" href=\"images/favicon.ico\" />\n<link rel=\"stylesheet\" type=\"text/css\" href=\"css/results.css\"><link rel=\"stylesheet\" type=\"text/css\" href=\"css/generale.css\">\n<script src=\"https://code.jquery.com/jquery-1.10.2.js\"></script>\n<header>\n<div id=\"header\" align=\"center\">\n<img src=\"images/beam.png\" class=\"imghead\"alt=\"logo\" name=\"logo\" />\n</div>\n<div id=\"navigation\" align=\"center\">\n<a class=\"menu\" href=\"/home\" target=\"_self\">Home</a> \n<a class=\"menu\" href=\"/documentation\" target=\"_self\">Documentation</a>\n<a class=\"menu\" href=\"/contacts\" target=\"_self\">Contacts</a>\n<a class=\"menu\" href=\"/download\" target=\"_self\">Downloads</a>\n</div>\n</header>\n";


		var info_run="<fieldset>\n<body>\n<p class=\"refresh\">If the page is blank/without data, refresh it.</p><br>\n<div id=\"info\">Details of your analysis:<br>\n<form method=\"get\" action=\""+reqRes+".zip\">Full results (.zip format):  \n<button class=\"scarica\" type=\"submit\">Download archive</button>\n</form><br>\n</div><br>\n";


		var scriptino='<script type="text/javascript">\n$(function() {\n $(\"td[colspan=5]\").hide();\n $(\"td.expand\").click(function(event) {\n event.stopPropagation();\nvar $target = $(event.target);\n if ( $target.closest(\"td\").attr("colspan") > 1) {\n $target.slideUp();\n $target.closest("tr").prev().find("td:first").html("+");\n}\n else { \n$target.closest("tr").next().find("td").slideToggle();\n if ($target.closest("tr").find("td:first").html() == "+") \n$target.closest("tr").find("td:first").html("-");\nelse \n$target.closest("tr").find("td:first").html("+");\n} \n});\n});\n</script>\n<script type="text/javascript">\n$(document).ready(function () {\n    size_li = $("#myList li").size();\n    x=3;\n    $("#myList li:lt("+x+")").show();\n    $("#loadMore").click(function () {\n        x= (x+5 <= size_li) ? x+5 : size_li;\n        $("#myList li:lt("+x+")").show();\n    });\n    $("#showLess").click(function () {\n        x=(x-5<0) ? 3 : x-5;\n        $("#myList li").not(":lt("+\n+")").hide();\n    });\n});\n</script>';


		var head = "<table id=\"motifs\" class=\"tab\">\n<thead>\n<tr>\n<th>\n<strong>MOTIF</strong>\n</th>\n<th>\n<strong>WEBLOGO</strong>\n</th>\n<th><strong>STATISTICS</strong>\n</th>\n<th><strong>HISTOGRAM</strong>\n</th>\n<th><strong>STRUCTURE</strong></th>\n</tr>\n</thead>\n<tbody>\n";

		var bottom = "</tbody>\n</table >\n</fieldset>\n</body>\n"+scriptino+"\n<footer>\n<div id=\"footer\">\n<img id=\"pic_footer\" src=\"images/logoTorVergat.png\" alt=\"logoTV\" />\n<div style=\"padding-top:20px;\"> © 2016, Centre for Molecular Bioinformatics, University of Rome \"Tor Vergata\".</div>\n</div>\n</footer>\n</html>";
		try{
			var notFoldedFile=fs.readFileSync(cartella+"not_folded.fa").toString();
			var notFolded=notFoldedFile.split('\n');
			var disc = (notFolded.length)/2;
			warning+='<table class="wow">\n<tr>\n<td class="expand">+</td>\n<td class="warning"> WARNING! There were a problem with folding method! '+parseInt(disc)+' seqeunces were discarded from BEAM analysis, are listed down below (an extended version of this list is available in the file not_folde.fa, in the results archive).\n</td></tr>\n<tr class=\"expanded\">\n<td  colspan=\"5\" >\n';
			for(i=0; i<notFolded.length; i=i+2)
				warning+='<div class="listEx">'+notFolded[i]+'</div>\n';
			warning+='</td></tr></table>';
		}
		catch (err){
			warning="";
		}
		var expanded2="";
		var temp="";
		var temp2="", temp3="";
		for (var i=0;i<(score.length);i++){
			listLenght=[];
			listStart=[];
			listEnd=[];
			listMotif=[];
			var expand = "";
			var tab = "";
			var num = i+1;
//debugger;
			getListMotif(cartella+reqRes+'_'+num+'_listMotif.txt');

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
			wb='<img id="wl" src="data:image/png;base64, '+temp2+'" tabindex="0"/>';

			pv=pvalue[i].split('=');
			pva=(parseFloat(pv[1].substring(0,7)));
			pva=math.format(pva,   {notation: 'exponential'});
			sc=score[i].split('=');
			co=coverage[i].split('=');

			tab+="\n<tr>\n<td class=\"expand\">+</td>\n<td>"+wb+"</td>\n<td>P-Value: "+ pva.toString() +"<br><br>\nBeam Score: "+ sc[1] +"<br><br>\nCoverage: "+ co[1] +"</td><td>\n<a href=\"data:image/png;base64, "+temp+"\" target=\"blank\">"+hist+"</a>\n</td><td>"+structure+"</td></tr>\n<tr class=\"expanded\"><td  colspan=\"5\" >\n";
			var limit=listMotif.length;
			if(limit>500)
				limit=500;
			debugger;				
			for(j in listMotif){
//			for(j=0; j<limit;j++){
				
				expand+='<div class="motif">'+listMotif[j][0]+' (Start: '+listMotif[j][4]+' End:'+listMotif[j][5]+')</div>\n<div class="score"> Score:'+listMotif[j][6]+'</div>\n<div class="disegno" style="width:'+(listMotif[j][1]*0.4)+'%">\n<div class="quad" style="width:'+(listMotif[j][3]-listMotif[j][2])+'%; margin-left:'+listMotif[j][2]+'%;"></div>\n</div>\n<br>';
			}
			expanded2+=tab+expand+'</td></tr>';
		}
		//console.log(reqRes);
		res.write(top+info_run+warning+head+expanded2+bottom);
		fs.writeFileSync(cartella+reqRes+'.html',top+info_run+warning+head+expanded2+bottom);
		res.end();
		runBash('cd results/'+reqRes+' && zip -r ../../public/'+reqRes+'.zip ./', reqRes);
	};

}
