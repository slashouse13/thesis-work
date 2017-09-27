import matplotlib.pyplot as plt
import numpy
import sys
temp=[]
temp2=[]
readed=open(sys.argv[1],'r')
#readed=open("sco1_bonus",'r')
toRead=readed.read()
fail=toRead.split()
readed.close()
for i in range (0,len(fail)):
	if (i%2==0):
		temp2.append(fail[i])
	else:
		temp.append(fail[i])

#cat1=map(float,temp)	#end
cat2=map(float,temp2) #start

bins=range(int(min(cat2)),int(max(cat2)),1)

#plt.hist(cat1, bins, color ='b', label='End position', alpha=.7, normed=True)
plt.hist(cat2, bins, color ='r', label='Start Position', alpha=.7, normed=True)
plt.legend()
plt.xlabel('Residue number')
plt.ylabel('%')
plt.title('Histogram for start-end motif')
plt.savefig(sys.argv[2])
