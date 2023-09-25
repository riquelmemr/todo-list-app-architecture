interface IHttpResponse {
  statusCode: number;
  body: any;
}

class HttpResponse {
  static badRequest(error: Error): IHttpResponse {
    return {
      statusCode: 400,
      body: {
        error: error.message,
      },
    };
  }

  static serverError(error: Error): IHttpResponse {
    return {
      statusCode: 500,
      body: {
        error: error.message,
      },
    };
  }

  static created(body: any): IHttpResponse {
    return {
      statusCode: 201,
      body,
    };
  }

  static ok(body: any): IHttpResponse {
    return {
      statusCode: 200,
      body,
    };
  }
}

export { HttpResponse, IHttpResponse };

