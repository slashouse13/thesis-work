import sys
listMotif=""
lunghezze=[]
start=[]
end=[]
nome=[]
score=[]

mass=1
readed=open(sys.argv[1],'r')
toRead=readed.readline()
while (toRead!= "\n"):		
	
	temp=(toRead.split('\t'))
	if(temp[1][-5:-2] != '_bg'):
		temp2=temp[1].split(' ')
		nome.append(temp2[len(temp2)-1][:-2])
		lunghezze.append(int(temp[2]))
		start.append(int(temp[3]))
		end.append(int(temp[4]))
		score.append(temp[5])
		
	toRead=readed.readline()

mass=max(lunghezze)
print lunghezze
for i in range(0,len(lunghezze)):
	
	listMotif+=nome[i]+"\t"+str(lunghezze[i]*100/mass)+"\t"+str(start[i]*100/lunghezze[i])+"\t"+str(end[i]*100/lunghezze[i])+"\t"+str(start[i])+"\t"+str(end[i])+"\t"+score[i]

readed.close()

inFile=open(sys.argv[2],'w')
inFile.write(listMotif)
inFile.close()

