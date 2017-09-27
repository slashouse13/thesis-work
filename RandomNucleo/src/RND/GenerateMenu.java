package RND;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Scanner;

public class GenerateMenu {

	public static void main(String[] args) throws IOException {
		boolean answer=true;
		int ans=0;
		@SuppressWarnings("resource")
		Scanner reader = new Scanner(System.in);  // Reading from System.in
		ArrayList<String> choices=new ArrayList<String>();
		choices.add("Generare un file con sequenze Random");
		choices.add("Inserire un motivo nella sequenza nucleotidica");
		choices.add("Inserire un motivo nella sequenza BEAR");
		ArrayList<String> files=new ArrayList<String>();
		files.add("randomSeqNucleo.fa");
		files.add(RandomNucleoSeq.nomeFileOut);
		files.add(Brutal.nomeFileOut);
		while(answer){
			System.out.println("1) "+choices.get(0)+"\n2) "+choices.get(1)+"\n3) "+choices.get(2)+"\n> ");
			ans=reader.nextInt();
			switch (ans){
			
			case 1: RandomNucleoSeq.nucleoRND();
				answer=false;
			break;
			case 2:	RandomNucleoSeq.insertMotif(Brutal.getBestPosition(RandomNucleoSeq.nomeFileIn));
				answer=false;	
			break;
			case 3: Brutal.editCatTwo();
				answer=false;	
			break;
			default: System.out.println("Scelta non valida!");
				answer=true;
			break;
			}
		}
		System.out.println("Fine esecuzione!!");
		System.out.println("Hai scelto di " + choices.get(ans-1) +"\nTroverai i risultati in "+files.get(ans-1));
	}
}
