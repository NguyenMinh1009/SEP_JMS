using SEP_JMS.Common.Utils;

namespace SEP_JMS.Common.Utils.Tests
{
    [TestFixture]
    public class DataVerificationUtilityTests
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        [TestCase("123456")]
        [TestCase("123456!@")]
        [TestCase("123456!@123")]
        [TestCase("123456!@Abc")]
        public void VerifyPasswordStrong_IsStrong_ReturnTrue(string input)
        {
            var result = DataVerificationUtility.VerifyPasswordStrong(input);
            Assert.IsTrue(result, $"{input} is not strong password!");
        }
    }
}