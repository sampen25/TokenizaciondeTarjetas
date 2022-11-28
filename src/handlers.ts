
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { docClient } from "./config/dbClient";
import { schema } from "./utils/validators";
import { v4 } from "uuid";
import * as Str from '@supercharge/strings'
import * as yup from "yup";

const tableName = "TokensTable";
const headers = {
  "content-type": "application/json",
};

export const createToken = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const reqBody = JSON.parse(event.body as string);

    await schema.validate(reqBody, { abortEarly: false });
    
    const dateNow = new Date();
    const dateExpiration = dateNow.setMinutes(15);

    const token = {
      ...reqBody,
      expiration_token: new Date(dateExpiration).toUTCString(), 
      tokenID: Str.random(16),    
    };

    await docClient
      .put({
        TableName: tableName,
        Item: token,
      })
      .promise();

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(token),
    };
  } catch (e) {
    return handleError(e);
  }
};

class HttpError extends Error {
  constructor(public statusCode: number, body: Record<string, unknown> = {}) {
    super(JSON.stringify(body));
  }
}

const fetchTokenById = async (id: string) => {
  const output = await docClient
    .get({
      TableName: tableName,
      Key: {
        tokenID: id,
      },
      AttributesToGet: [
        'card_name', 
        'expiration_month',
        'expiration_year',
        'email',
        'tokenID',
        'expiration_token'
      ],
    })
    .promise();

  if (!output.Item) {
    throw new HttpError(404, { error: "No se encontró el token" });
  }

  return output.Item;
};

const handleError = (e: unknown) => {
  if (e instanceof yup.ValidationError) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        errors: e.errors,
      }),
    };
  }

  if (e instanceof SyntaxError) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: `Formato inválido de request body : "${e.message}"` }),
    };
  }

  if (e instanceof HttpError) {
    return {
      statusCode: e.statusCode,
      headers,
      body: e.message,
    };
  }

  throw e;
};

interface Custom {
  card_name: string,
  cvv: string,
  expiration_month: number,
  expiration_year: number,
  email: string,
  expiration_token: string,
  tokenID: string
}

export const getToken = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const token = await fetchTokenById(event.pathParameters?.id as string);

    const ItemWithCustomType = (token as Custom);
    const expirationToken = ItemWithCustomType.expiration_token;
    
    const dateExpiration = new Date(expirationToken);
    const dateNow = new Date();
    
    if (dateNow.getTime() < dateExpiration.getTime()) 
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: `Token expirado`}),
      }
    else
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(token),
      };
  } catch (e) {
    return handleError(e);
  }
};


