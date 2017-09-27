import re
import sys
inFile=open(sys.argv[1])
readed=inFile.read()
listing=readed.split('\n')
inFile.close()
loop=re.compile('[xswcdenyb]')
stemBr=re.compile('[vfrt]')

mass=[0 for x in range(len(listing)-1)]
listQbear=[]
toFile=""
for i in range(0,len(listing)-1):
	temp=listing[i].split('\t')
	qbear=temp[1]
	dim=len(qbear)
	pos=0
	numLoop=0
	best=0
	maxim=0
	stem=0
	usable=True
	inLoop=False
	for j in range(0, dim-1):
		if(qbear[j]=='*'):
			usable=False
			break
		if(loop.search(qbear[j])!=None):
			temp=qbear[-(dim-j-1):]
			asdf=qbear[:j]
			inLoop=True
			qbear=qbear[:j]+'.'+qbear[-(dim-j-1):]
			best+=1
			if(best>maxim):
				maxim=best
				pos=j-best

		else:	
			best=0
	for j in range(0,dim-1):
		if (((qbear[j])!='.')):
			if(j>pos):
				qbear=qbear[:j]+')'+qbear[-(dim-j-1):]
			else:
				qbear=qbear[:j]+'('+qbear[-(dim-j-1):]
	qbear=qbear[:dim-1]+')'
	#Potrebbe essere un funzione che 'trimma' l'hairpin
	openedSteam=0
	startCl=0
	startOp=0
	closedSteam=0

	for j in range (0, dim):
		if(qbear[j]=='('):
			if(qbear[j+1]!='('):
				startOp=j
			openedSteam+=1
		else:
			if(qbear[j]==')'):
				if(startCl==0):
					startCl=j
				closedSteam+=1

	if (closedSteam<openedSteam):
		j=startCl
		x=closedSteam
		k=startOp
		y=x
		while (x>0 or y>0):
			if(k>0):
				if(qbear[k]=='('):
					y-=1
				k-=1
			if(j<dim):
				if(qbear[j]==')'):
					x-=1
				j+=1
		temp=qbear[(k+1):(j)]
	else:
		j=startCl
		x=openedSteam-1
		k=startOp
		y=x
		while (x>0 or y>0):
			if(k>0):
				if(qbear[k]=='('):
					y-=1
				k-=1
			if(j<dim):
				if(qbear[j]==')'):
					x-=1
				j+=1
		temp=qbear[(k):(j+1)]
	if(usable):
		if(re.search('([xvf])',temp)==None):
			listQbear.append(temp)
			toFile+=(temp+"\n")
	else:
		toFile+="\n"

if(toFile==""):
	print "No valid structure available"
	inFile=open(sys.argv[2],'w')
	inFile.close()
else:
	inFile=open(sys.argv[2],'w')
	inFile.write(toFile)
	inFile.close()
