openssl req -subj '/CN=www.mydom.com/O=My Company Name LTD./C=US' -x509 -nodes -newkey rsa:2048 -keyout key -out key.pub
