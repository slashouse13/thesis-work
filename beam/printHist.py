import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy
import sys
import seaborn as sns
temp=[]
temp2=[]
failt=[]
readed=open(sys.argv[1],'r')
toRead=readed.readline()
while toRead!='':

	failt=toRead.split('\t')
	temp2.append(failt[0])
	temp.append(failt[1])
	toRead=readed.readline()
	failt=[]
readed.close()
cat1=(map(float,temp))	#end
cat2=map(float,temp2) 	#start
temp=[]
temp2=[]
bins=range(int(min(cat2)),int(max(cat1)),1)
size=cat1[-1]-cat2[-1]
coverage=[item for sublist in [range(int(s),int(s+size)) for s in cat2] for item in sublist]
#plt.hist(cat1, bins, color ='b', label='End position', alpha=.7, normed=True)
metay,metax,_=plt.hist(coverage, bins, label='Motif Position', alpha=.7, normed=True)

plt.legend()
plt.ylim([0, metay.max()*1.2])
plt.plot([metax.min()+1,metax.min()+1+size], [1.1*metay.max(),1.1*metay.max()],'k-', lw=2)
plt.text(x=metax.min()+1,y=1.05*metay.max(),s="width=%d" % (size))
plt.xlabel('Residue number')
plt.ylabel('%')
plt.title('Histogram for motif position')
plt.savefig(sys.argv[2])
