using Microsoft.AspNetCore.Mvc;

namespace SEP_JMS.Tests
{
    public static class ActionResultExtension
    {
        public static T? ReturnValue<T>(this ActionResult<T> result)
        {
            return result.Result == null ? result.Value : (T?)((ObjectResult)result.Result)?.Value;
        }

        public static int? StatusCode<T>(this ActionResult<T> result)
        {
            if (result.Result is OkObjectResult okResult) return okResult.StatusCode;
            else if (result.Result is OkResult okRs) return okRs.StatusCode;
            else return null;
        }

        public static int? StatusCode(this IActionResult result)
        {
            if (result is OkObjectResult okResult) return okResult.StatusCode;
            if (result is OkResult okRs) return okRs.StatusCode;
            if (result is BadRequestObjectResult badRqO) return badRqO.StatusCode;
            if (result is StatusCodeResult sC) return sC.StatusCode;
            else return null;
        }
    }
}
