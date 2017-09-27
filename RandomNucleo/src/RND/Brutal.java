package RND;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;

public class Brutal {
	public static final String nomeFileIn="biores.fa";
	public static final String nomeFileOut="newres.fa";
	
	public static void editCatTwo(){
		String toOutput="";
		boolean cat=false;
		ArrayList<String> readFile;
		try {
			int seqNum=0;
			int[] startPos = getBestPosition(nomeFileIn);
			readFile = RandomNucleoSeq.readFromFile(nomeFileIn);
			for (String read : readFile){
				switch ((readFile.indexOf(read)+1)%4){
				
				case 1://Nome
					if(read.contains("Cat02")){
						toOutput+=read;
						cat = true;
					}
					else{
						toOutput+=read;
						cat=false;
					}
					break;
				case 2://nucleotidi
					if (cat)
						toOutput+=read.substring(0, read.indexOf(RandomNucleoSeq.moNucl))+giveMeRandomSeq(RandomNucleoSeq.moNucl.length())+read.substring(read.indexOf(RandomNucleoSeq.moNucl)+RandomNucleoSeq.moNucl.length());
						//toOutput+=read.substring(0, startPos[seqNum])+giveMeRandomSeq(RandomNucleoSeq.moNucl.length())+read.substring(seqNum+1);
					else
						toOutput+=read;
					break;
//				case 0:
//					if (cat)
//						toOutput+=read.substring(0, startPos[seqNum])+RandomNucleoSeq.moBear+read.substring(seqNum+1);
//					else
//						toOutput+=read;
//					break;
				default:
					toOutput+=read;
					break;
				}
				toOutput+="\n";
				seqNum++;
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		///OUTPUT
		try {
			RandomNucleoSeq.outputFile(toOutput, nomeFileOut);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static int[] getBestPosition(String nameFile) throws FileNotFoundException{
		// Si prende outres
		int[] start = null;
		int i=-1;
		try {
			ArrayList<String> readFile = RandomNucleoSeq.readFromFile(nameFile);
			int counter=1;
			int tot=readFile.size();
			start= new int[tot];
			for (String read : readFile){
				//Cerca solo in BEAR
				if (counter%4==0)
					start[++i]=searchForBestSpot(read);
				counter++;
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return start;
	}
	
	private static int searchForBestSpot(String readed) {
		// TODO Auto-generated method stub
		// Analisi della stringa bear - Cerchiamo la ripetizione del ":" più lunga
		int pos=0, max=0, current=0;
		for (char c : readed.toCharArray())
			if (c==':')
				current++;
			else{
				if(current>max){
					max=current;
					pos=readed.indexOf(c);
				}
				current=0;
			}
		//return pos+(max/2);
		return pos;
	}
	
	static String giveMeRandomSeq(int len){
		String randomThing="";
		for (int i=0;i< len;i++)
			randomThing+=RandomNucleoSeq.set.charAt((int) (Math.random()*4));
		return randomThing;
	}
}