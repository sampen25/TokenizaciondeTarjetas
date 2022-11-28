
=====PRE-REQUISITOS====
AWS CLI instalado y configurado
serverless
node.js

=====INSTALACIÓN=====
1. Ejecutar:
    npm install

=====DESPLIEGUE=====
1. AWS Lambda :
    Ejecutar(terminal): serverless deploy
    Postman (Ejemplos):
        -POST | https://aeq0s4zc63.execute-api.us-east-2.amazonaws.com/token
        -GET  | https://aeq0s4zc63.execute-api.us-east-2.amazonaws.com/token/{id}

2. Localmente (desconectado):
    Ejecutar(terminal): serverless offline
    Postman (Ejemplos):
        -POST | http://localhost:3000/token     
        {
            "card_name" : "4238974880200981",
            "cvv" : "721",
            "expiration_month" : 12,
            "expiration_year" : 2023,
            "email" : "sampen44@gmail.com"
        }
        -GET  | http://localhost:3000/token/{id}     

=====GENERAR BUILD=====
1. Ejecutar:
    npm run build