namespace Harmony.Middlewares
{
    public class ResponseMiddleware(RequestDelegate next, ILogger<ResponseMiddleware> logger)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            var originalBodyStream = context.Response.Body;

            using (var responseBody = new MemoryStream())
            {
                context.Response.Body = responseBody;
                await next(context);

                var responseBodyContent = await ReadResponseBody(context.Response);

                logger.LogInformation("--> Caminho da requisição: {Path}", context.Request.Path);
                logger.LogInformation("--> Corpo da resposta: {Body}", responseBodyContent[..Math.Min(responseBodyContent.Length, 100)] + "...");

                await responseBody.CopyToAsync(originalBodyStream);
            }
        }

        private async Task<string> ReadResponseBody(HttpResponse response)
        {
            response.Body.Seek(0, SeekOrigin.Begin);

            string text = await new StreamReader(response.Body).ReadToEndAsync();

            response.Body.Seek(0, SeekOrigin.Begin);
            return text;
        }
    }
}
