package RND;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class motifRandom {

	public static void main(String[] args) throws IOException {
		// TODO Auto-generated method stub
		String nameFile="bioutres.fa", temp;
		FileReader file = new FileReader (nameFile);
		BufferedReader reader = new BufferedReader(file);
		int cat=0, pos=58;
		@SuppressWarnings("unused")
		String toseq="ccc!!ddddrrrrrrrrrdddd22ccc",toDot="Anche in dot bracket";
		boolean flag=false;
		FileWriter fw= new FileWriter("lolout"+nameFile);
		BufferedWriter writer = new BufferedWriter(fw);
		while ((temp=reader.readLine())!=null){
			if(temp.contains("Cat")){
				//System.out.println(temp.substring(7,9));
				cat=Integer.parseInt(temp.substring(7,9));
				if(cat==1)
					flag=true;
				else
					flag=false;
			}
			else
				if(flag){
					if(temp.matches("^[acgurymkswbdhvntACGURYMKSWBDHVNT]*$"))
						;
					else
					if(temp.matches("^[.()]*$"))
					;	//temp=temp.substring(0,pos)+toDot+temp.substring(60, temp.length()-toseq.length());
					else
						temp=temp.substring(0,pos)+toseq+temp.substring(60, temp.length()-toseq.length());
					
				}
				
			writer.write(temp+"\n");
			writer.flush();
		}
		file.close();
		fw.close();
	}

}
