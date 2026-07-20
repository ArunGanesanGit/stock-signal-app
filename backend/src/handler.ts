import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import app from "./app";

let cachedApp: any = null;

const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!cachedApp) {
    cachedApp = app;
  }

  return new Promise((resolve) => {
    cachedApp(event as any, {} as any, (error: any, response: any) => {
      if (error) {
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: "Internal server error" })
        } as APIGatewayProxyResult);
      } else {
        resolve(response as APIGatewayProxyResult);
      }
    });
  });
};

export { handler };
