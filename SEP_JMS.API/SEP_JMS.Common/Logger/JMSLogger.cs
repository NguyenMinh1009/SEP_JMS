using Serilog;

namespace SEP_JMS.Common.Logger
{
    public class JMSLogger : IJMSLogger
    {
        public void Error(string message)
        {
            Log.Error($"User: [{ApiContext.Current.UserId}] [{ApiContext.Current.Username}] CorrelationId: {ApiContext.Current.CorrelationId}. Message: {message}");
        }

        public void Info(string message)
        {
            Log.Information($"User: [{ApiContext.Current.UserId}] [{ApiContext.Current.Username}] CorrelationId: {ApiContext.Current.CorrelationId}. Message: {message}");
        }

        public void Warn(string message)
        {
            Log.Warning($"User: [{ApiContext.Current.UserId}] [{ApiContext.Current.Username}] CorrelationId: {ApiContext.Current.CorrelationId}. Message: {message}");
        }
    }
}
