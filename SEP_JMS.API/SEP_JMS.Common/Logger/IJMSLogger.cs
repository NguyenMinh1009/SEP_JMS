namespace SEP_JMS.Common.Logger
{
    public interface IJMSLogger
    {
        public void Info(string message);
        public void Warn(string message);
        public void Error(string message);
    }
}
