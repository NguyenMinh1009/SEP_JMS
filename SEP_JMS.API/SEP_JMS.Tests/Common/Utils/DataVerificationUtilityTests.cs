using SEP_JMS.Common.Utils;

namespace SEP_JMS.Tests.Common.Utils
{
    [TestFixture]
    public class DataVerificationUtilityTests
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        [TestCase("123456", ExpectedResult = false)]
        [TestCase("123456!@", ExpectedResult = true)]
        [TestCase("123456!@123", ExpectedResult = true)]
        [TestCase("123456!@Abc", ExpectedResult = true)]
        public bool VerifyPasswordStrong_IsStrong_ReturnTrue(string input)
        {
            return DataVerificationUtility.VerifyPasswordStrong(input);
        }
    }
}