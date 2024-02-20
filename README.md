# Server_IoT

##Para copiar arquivo para servidor <https://www.dacsolution.com.br/central/index.php?rp=/knowledgebase/24/Copia-de-arquivos-via-SSH-entre-dois-servidores-remotos.html>
scp -r D:/documentos/GitHub/Server_IoT admin@192.168.2.107:/var/www/html

Para quem não sabe, SCP é um protocolo que permite copiar arquivos entre um servidor SSH e uma máquina local. Para funcionar o comando scp é necessário que já tenha configurado uma conexão SSH com um servidor remoto, feito isso, veja os exemplos na prática abaixo:

Copiando um arquivo remoto para máquina local:
scp user@domain:/pasta-remota/arquivo-remoto.txt /pasta-local/arquivo-local.txt

Enviando um arquivo local para um servidor remoto:
scp /pasta-local/arquivo-local.txt user@domain:/pasta-remota/arquivo-remoto.txt

Copiando pastas e subpastas do servidor remoto para máquina local:
scp -r user@domain:/pasta-remota/ /pasta-local/

Enviando pastas e subpastas da máquina local para o servidor remoto:
scp -r /pasta-local/ user@domain:/pasta-remota/

acessar pelo terminal via ssh
ssh admin@192.168.2.107