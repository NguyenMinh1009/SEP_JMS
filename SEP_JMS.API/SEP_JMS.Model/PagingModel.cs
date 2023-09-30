namespace SEP_JMS.Model
{
    public class PagingModel<T>
    {
        public List<T> Items { get; set; } = new List<T>();

        public int Count { get; set; } = 0;
    }
}
