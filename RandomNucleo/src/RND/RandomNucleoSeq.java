package RND;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Scanner;

public class RandomNucleoSeq {
	
	public static int fixedPos=60;
	final static String set="AGCU";
	final static String moNucl="GACGUACUUCAUAGGAUCAUUUCUAUAGUAGACGUC";
	final static String moBear="ccc[dddd!!ffffffmmmmffffffdddd333ccc";
	public static final String nomeFileIn="bioutres.fa";
	public static final String nomeFileOut="edited.fa";
	public static final int categories = 3;
	
	public static void nucleoRND() throws IOException{
		String finalThing=new String();
		@SuppressWarnings("resource")
		Scanner reader = new Scanner(System.in);  // Reading from System.in
//		System.out.println("Vuoi che sia generato un motivo in posizione random? (y/n) ");
//		String ans = reader.next();
		String ans = "n";
		System.out.println("Quante sequenze? ");
		int n = reader.nextInt();
		if(n<40){n=20; System.out.println("Troppe poche sequenze!! Default:20");	}
		System.out.println("Lunghezza? ");
		int l = reader.nextInt();
		if(l<50){l=50; System.out.println("Troppo corte!! Default:50");	}
		int maxCat=n/categories, num01=0, num02=0;
		int limitStart=l-moNucl.length();
		for(int j=0;j<n;j++){
			int cat=(((int) (Math.random()*categories))+1);
			if(ans.equals("y"))
				fixedPos=(((int) (Math.random()*limitStart))+1);
			if (num01<maxCat)
				if (cat==1)
					num01++;
				else
					;
			else
			if (num02<maxCat)
				if (cat==2)
					num02++;
				else
				;
			else
				cat=3;					
			finalThing+=">SeqCat0"+cat+"|"+j+"\n";
			String nucleo=new String();
			for (int i=0; i<l; i++)
				nucleo+=(set.charAt((int) (Math.random()*4)));
			
			// Inserimento motivo in sequenza
//			if(cat==1){
//				nucleo=nucleo.substring(0,fixedPos)+moNucl+nucleo.substring(fixedPos, limitStart);
//				//int g=motifs.get(0).length();
//				//bear=bear.substring(0,tempStart)+motifs.get(0)+bear.substring(tempStart, limitStart);
//			}
			
			finalThing+=nucleo+"\n";//+bear+"\n";
		}
		outputFile(finalThing, "randomSeqNucleo.fa");
		//System.out.println("Numero cat01 = "+num01);
	}
	

	public static void outputFile(String asdf, String file) throws IOException{
		Writer writer = null;
		try {
			writer = new BufferedWriter(new OutputStreamWriter(
					new FileOutputStream(file), "utf-8"));
			writer.write(asdf);

		} catch (IOException ex) {
		} finally {
			try{writer.close();} catch (Exception ex) {}
		}

	}
	
	public static ArrayList<String> readFromFile(String name) throws IOException{
		FileReader file = new FileReader (name);
		ArrayList<String> read = new ArrayList<String>();
		//read.add("");
		String temp;
		BufferedReader reader = new BufferedReader(file);
		while ((temp= reader.readLine()) != null){
			read.add(temp);
		}
		reader.close();
		return read;
	}
	
	
	public static void insertMotif(int[] startPos) throws FileNotFoundException{
		// Si prende randomSeqNucleo.fa
		String toOutput="";
		int seqNum=-1;
		boolean cat = false;
		try {
			ArrayList<String> readFile = readFromFile(nomeFileIn);
			for (String read : readFile){
				switch ((readFile.indexOf(read)+1)%4){
				
				case 1://Nome
					
					if(read.contains("Cat01") || read.contains("Cat02")){
						toOutput+=read+"\n";
						cat = true;
					}
					else{
						toOutput+=read+"\n";
						cat=false;
					}
					seqNum++;

					break;
				case 2://nucleotidi
					if (cat){
						//System.out.println(startPos[seqNum]);
						toOutput+=read.substring(0, startPos[seqNum])+moNucl+read.substring(startPos[seqNum]+1)+"\n";
						
					}
					else{
						toOutput+=read+Brutal.giveMeRandomSeq(moNucl.length()-1)+"\n";
					}
					break;
//				default:
//					toOutput+=read+"\n";
//					break;
				}
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			outputFile(toOutput, nomeFileOut);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	
	
}