package cleanup;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class Clean {
	

	public static void main(String[] args) throws IOException{
		String nameFile="res.fa", temp;
		FileReader file = new FileReader (nameFile);
		BufferedReader reader = new BufferedReader(file);
		FileWriter fw= new FileWriter("out"+nameFile);
		BufferedWriter writer = new BufferedWriter(fw);
		while ((temp=reader.readLine())!=null){
			if (temp.contains(" "))
				temp=temp.substring(0, temp.indexOf(" "));
			writer.write(temp+"\n");
			writer.flush();

		}

		file.close();
		fw.close();
		System.out.println("Fine!!!!");
	}
	
}
