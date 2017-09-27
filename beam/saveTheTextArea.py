import sys
readed=open(sys.argv[1],'r')
toRead=readed.readline()
writed=open(sys.argv[2],'w')
wr=""
while (toRead!=""):
	temp= toRead.split('\r')	
	wr+=temp[0]+'\n'
	toRead=readed.readline()
readed.close()
writed.write(wr)
writed.close()
